import { gemini } from "@/lib/openai";
import { streamText } from "ai";
import { SendMessageSchema } from "@/lib/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { playground, message as MessageTable } from "@/server/db/schema";
import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantVectorStore } from "@langchain/qdrant";
import { eq, asc } from "drizzle-orm";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  const { playgroundId, message } = SendMessageSchema.parse(body);

  const playgroundExists = await db.query.playground.findFirst({
    where: eq(playground.id, playgroundId),
  });

  if (!playgroundExists) {
    return new Response("Playground not found", { status: 404 });
  }

  await db.insert(MessageTable).values({
    playgroundId,
    userId: session.user.id,
    message,
    isUserMessage: true,
  });

  // Vectorize the message.
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://192.168.29.113:11434",
  });

  const store = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: "http://192.168.29.113:6333",
    collectionName: playgroundId,
  });

  const results = await store.similaritySearch(message, 4);

  console.log("🟢 Results: ", results);

  const previousMessage = await db.query.message.findMany({
    where: eq(MessageTable.playgroundId, playgroundId),
    orderBy: asc(MessageTable.createdAt),
    limit: 6,
  });

  const formattedMessages = previousMessage.map((message) => ({
    role: message.isUserMessage ? "user" : ("assistant" as const),
    content: message.message,
  }));

  try {
    console.log("🟢 GEMINI CALLED");
    const googleResponse = await streamText({
      model: gemini("gemini-1.5-flash"),
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. 
        \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedMessages.map((message) => {
          if (message.role === "user") return `User: ${message.content}\n`;
          return `Assistant: ${message.content}\n`;
        })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join("\n\n")}
        
        USER INPUT: ${message}`,
        },
      ],
      onFinish: async ({ text }) => {
        await db.insert(MessageTable).values({
          playgroundId,
          userId: session.user.id,
          message: text,
          isUserMessage: false,
        });
      },
    });
    return googleResponse.toTextStreamResponse();
  } catch (error) {
    console.log("🔴 GOOGLE ERROR: ", error);
    throw new Error("Unable to fetch results");
  }
};
