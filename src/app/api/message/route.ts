import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@/server/auth";
import { findRelevantContent } from "@/lib/embeddings";
import { NextRequest } from "next/server";
import { SendMessageSchema } from "@/lib/schema";

export const POST = async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await request.json();
  const { content } = SendMessageSchema.parse(messages[0]);

  const context = await findRelevantContent(content);

  const googleResponse = await streamText({
    model: google("gemini-1.5-flash"),
    temperature: 0.8,
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
      Only respond to questions using information from the given context.
      take liberties in answering and give a medium to lengthy reply to all queries unless speciefied otherwise.
      if no relevant information is found in the given context context,
      respond kindly that you are a chatbot specilising in reading Files and answering, general conversation is not possible.`,
    prompt: ` QUERY: ${content}

      \n -------------------------- \n

      CONTEXT:
      ${context.map((c) => c.name)}`,
  });

  return googleResponse.toDataStreamResponse();
};
