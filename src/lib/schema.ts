import { z } from "zod";

export const ModelSettingsSchema = z.object({
  model: z.string(),
  temperature: z.number(),
  maxOutputTokens: z.number(),
  topP: z.number(),
  topK: z.number(),
});

export const createPlaygroundSchema = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  description: z.string().max(100).optional(),
});

export const SendMessageSchema = z.object({
  playgroundId: z.string(),
  message: z.string(),
});

export const insertEmbeddingsSchema = z.object({
  playgroundId: z.string().max(255),
  fileId: z.string().max(255),
  fileURL: z.string(),
});
