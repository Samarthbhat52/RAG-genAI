import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { count, eq } from "drizzle-orm";
import { file as fileTable } from "@/server/db/schema";
import { z } from "zod";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantVectorStore } from "@langchain/qdrant";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .input(z.object({ playgroundId: z.string() }))
    .middleware(async ({ req, input }) => {
      const session = await auth();

      if (!session) throw new UploadThingError("Unauthorized");

      // Check if the uploading user has exceeded the file limit
      const files = await db
        .select({ count: count() })
        .from(fileTable)
        .where(eq(fileTable.userId, session.user.id));

      if (files[0] && files[0].count >= 15) {
        throw new UploadThingError(
          "Exceeded file limit. Max 15 files per user",
        );
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id, playgroundId: input.playgroundId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (!file.key) {
        throw new UploadThingError("Upload unsuccessful");
      }

      const uploadedFile = await db
        .insert(fileTable)
        .values({
          userId: metadata.userId,
          name: file.name,
          key: file.key,
          url: file.url,
          uploadStatus: "PENDING",
          playgroundId: metadata.playgroundId,
        })
        .returning({ id: fileTable.id });

      // Create embeddings for the pdf
      try {
        const response = await fetch(file.url);

        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const docs = await loader.load();

        const embeddings = new OllamaEmbeddings({
          model: "nomic-embed-text",
          baseUrl: "http://192.168.29.113:11434",
        });

        await QdrantVectorStore.fromDocuments(docs, embeddings, {
          url: "http://192.168.29.113:6333",
          collectionName: metadata.playgroundId,
          collectionConfig: {
            vectors: { size: 768, distance: "Cosine", on_disk: true },
            on_disk_payload: true,
          },
        });

        await db.insert(fileTable).values({
          userId: metadata.userId,
          name: file.name,
          key: file.key,
          url: file.url,
          uploadStatus: "SUCCESS",
          playgroundId: metadata.playgroundId,
        });
      } catch (error) {
        await db.insert(fileTable).values({
          userId: metadata.userId,
          name: file.name,
          key: file.key,
          url: file.url,
          uploadStatus: "FAILED",
          playgroundId: metadata.playgroundId,
        });
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
