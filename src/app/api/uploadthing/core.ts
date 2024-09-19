import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { count, eq } from "drizzle-orm";
import { file as fileTable } from "@/server/db/schema";
import { z } from "zod";

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
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        key: file.key,
        id: uploadedFile[0]?.id!,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
