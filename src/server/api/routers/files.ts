import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { file } from "@/server/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const filesRouter = createTRPCRouter({
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
