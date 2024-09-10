import { z } from "zod";

export const ModelSettingsSchema = z.object({
  model: z.string(),
  temperature: z.number(),
  maxOutputTokens: z.number(),
  topP: z.number(),
  topK: z.number(),
});
