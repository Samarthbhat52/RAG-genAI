import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@/server/auth";
import { findRelevantContent } from "@/lib/embeddings";
import { NextRequest } from "next/server";
import { SendMessageSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { message as messageTable } from "@/server/db/schema";

export const POST = async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { playgroundId, message } = SendMessageSchema.parse(body);

  await db.insert(messageTable).values({
    playgroundId,
    userId: session.user.id,
    message,
    isUserMessage: true,
  });

  const context = await findRelevantContent({
    userQuery: message,
    playgroundId,
  });

  const googleResponse = await streamText({
    model: google("gemini-1.5-flash"),
    temperature: 0.4,
    topK: 4,
    topP: 0.95,
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
      Only respond to questions using information from the given context.
      take liberties in answering and give a medium to lengthy reply to all queries unless speciefied otherwise.
      if no relevant information is found in the given context context,
      respond kindly that you are a chatbot specilising in reading Files and answering, general conversation is not possible.`,
    prompt: ` QUERY: ${message},
      \n -------------------------- \n

      CONTEXT:
      ${context.map((c) => c.name)}`,

    onFinish: async (response) => {
      await db.insert(messageTable).values({
        playgroundId,
        userId: session.user.id,
        message: response.text,
        isUserMessage: false,
      });
    },
  });

  return googleResponse.toDataStreamResponse();
};
