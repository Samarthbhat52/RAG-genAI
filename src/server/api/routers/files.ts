import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { file } from "@/server/db/schema";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
        ),
        orderBy: desc(file.createdAt),
      });

      return files ?? [];
    }),
});
