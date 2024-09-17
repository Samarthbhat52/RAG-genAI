import { insertEmbeddingsSchema } from "@/lib/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateEmbeddings } from "@/lib/embeddings";
import { embeddings as embeddingsTable } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const embeddingRouter = createTRPCRouter({
  createResource: protectedProcedure
    .input(insertEmbeddingsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await fetch(input.fileURL);
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        const docs = await loader.load();

        const content = docs.map((doc) => doc.pageContent);

        const embeddings = await generateEmbeddings(content);

        await ctx.db.insert(embeddingsTable).values(
          embeddings.map((e) => ({
            playgroundId: input.playgroundId,
            fileId: input.fileId,
            ...e,
          })),
        );
      } catch (err) {
        console.error("🔴 Error while inserting: ", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
