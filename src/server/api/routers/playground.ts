import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { file, playground } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { unsplash } from "@/lib/unsplash";
import { UTApi } from "uploadthing/server";

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

  createPlayground: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        description: z.string().max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const image = await unsplash.photos.getRandom({
        count: 1,
      });

      const newImage = image.response as Array<Record<string, any>>;

      const createdPlayground = await ctx.db
        .insert(playground)
        .values({
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
          image: newImage[0]?.urls.regular ?? "",
        })
        .returning();

      return createdPlayground[0];
    }),

  deletePlayground: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const utapi = new UTApi();

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

      const files = await ctx.db
        .select({ key: file.key })
        .from(file)
        .where(
          and(
            eq(file.playgroundId, input.id),
            eq(file.userId, ctx.session.user.id),
          ),
        );

      try {
        await utapi.deleteFiles(files.map((file) => file.key));
      } catch (error) {
        throw new TRPCError({
          message: "Error while deleting playground",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

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
