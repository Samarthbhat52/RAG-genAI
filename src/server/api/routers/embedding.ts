import { insertEmbeddingsSchema } from "@/lib/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateEmbeddings } from "@/lib/embeddings";
import { embeddings as embeddingsTable } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { file } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const embeddingRouter = createTRPCRouter({
  createResource: protectedProcedure
    .input(insertEmbeddingsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("🟢 Creating embeddings...");

        // Create embeddings for the pdf
        const response = await fetch(input.fileURL);
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        // Get the entire document separated by pages
        const docs = await loader.load();

        // retrieve an array of page content
        const content = docs.map((doc) => doc.pageContent);
        // create embeddings
        const embeddings = await generateEmbeddings(content);

        console.log("🟢 Embeddings created successfully");
        console.log("🟢 Inserting embeddings...");

        await ctx.db.insert(embeddingsTable).values(
          embeddings.map((e) => ({
            playgroundId: input.playgroundId,
            fileId: input.fileId,
            ...e,
          })),
        );
        console.log("🟢 Embeddings inserted successfully");

        await ctx.db
          .update(file)
          .set({
            uploadStatus: "SUCCESS",
          })
          .where(eq(file.id, input.fileId));
      } catch (err) {
        console.error("🔴 Error while inserting: ", err);

        await ctx.db
          .update(file)
          .set({
            uploadStatus: "FAILED",
          })
          .where(eq(file.id, input.fileId));
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
