import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { playground } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const playgroundRouter = createTRPCRouter({
  getAllPlaygrounds: protectedProcedure.query(async ({ ctx }) => {
    const playgrounds = await ctx.db.query.playground.findMany({
      where: eq(playground.userId, ctx.session.user.id),
      orderBy: desc(playground.createdAt),
    });

    return playgrounds ?? null;
  }),
  getSinglePlayground: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const playgroundExists = await ctx.db.query.playground.findFirst({
        where: eq(playground.id, input.id),
      });

      return playgroundExists ?? null;
    }),

  deletePlayground: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const playgroundAvailable = await ctx.db.query.playground.findFirst({
        where: and(
          eq(playground.userId, ctx.session.user.id),
          eq(playground.id, input.id),
        ),
      });

      if (!playgroundAvailable)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      await ctx.db
        .delete(playground)
        .where(
          and(
            eq(playground.userId, ctx.session.user.id),
            eq(playground.id, input.id),
          ),
        );
    }),
});
