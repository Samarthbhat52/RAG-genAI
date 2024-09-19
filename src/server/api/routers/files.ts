import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { file } from "@/server/db/schema";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";

export const filesRouter = createTRPCRouter({
  getAllFilesCount: protectedProcedure.query(async ({ ctx }) => {
    const filesCount = await ctx.db
      .select({ count: count() })
      .from(file)
      .where(and(eq(file.userId, ctx.session.user.id)));

    return filesCount;
  }),

  getFiles: protectedProcedure
    .input(z.object({ playgroundId: z.string() }))
    .query(async ({ ctx, input }) => {
      const files = await ctx.db.query.file.findMany({
        where: and(
          eq(file.userId, ctx.session.user.id),
          eq(file.playgroundId, input.playgroundId),
          eq(file.uploadStatus, "SUCCESS"),
        ),
        orderBy: desc(file.createdAt),
      });

      return files ?? [];
    }),

  getFileUploadStatus: protectedProcedure
    .input(z.object({ file_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const fileExists = await ctx.db.query.file.findFirst({
        where: and(
          eq(file.userId, ctx.session.user.id),
          eq(file.key, input.file_id),
        ),
      });

      if (!fileExists) return { status: "PENDING" as const };

      return { status: fileExists.uploadStatus };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const utapi = new UTApi();

      const fileAvailable = await ctx.db.query.file.findFirst({
        where: and(
          eq(file.userId, ctx.session.user.id),
          eq(file.key, input.key),
        ),
      });

      if (!fileAvailable)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      try {
        await utapi.deleteFiles([input.key]);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      await ctx.db
        .delete(file)
        .where(
          and(eq(file.userId, ctx.session.user.id), eq(file.key, input.key)),
        );
    }),
});
