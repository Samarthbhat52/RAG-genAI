import { gemini } from "@/lib/gemini";
import { embedMany } from "ai";

const embeddingModel = gemini.embedding("text-embedding-004", {
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
