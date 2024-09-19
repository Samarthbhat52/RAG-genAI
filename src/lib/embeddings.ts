import { db } from "@/server/db";
import { embeddings } from "@/server/db/schema";
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { cosineDistance, desc, sql, gt } from "drizzle-orm";

const embeddingModel = google.embedding("text-embedding-004", {
  outputDimensionality: 768,
});

export const generateEmbeddings = async (
  pages: string[],
): Promise<Array<{ content: string; vectors: number[] }>> => {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: pages,
  });

  return embeddings.map((e, i) => ({
    content: pages[i] as string,
    vectors: e as number[],
  }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.vectors,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    // .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(2);

  return similarGuides;
};
