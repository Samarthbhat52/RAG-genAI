import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/env";

export const gemini = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GEMINI_API,
});
