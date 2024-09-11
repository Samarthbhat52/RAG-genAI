import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { file, playground } from "@/server/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const filesRouter = createTRPCRouter({
  getFiles: protectedProcedure.query(async ({ ctx }) => {
    const files = await ctx.db.query.file.findMany({
      where: eq(file.userId, ctx.session.user.id),
      orderBy: desc(file.createdAt),
    });

    return files ?? [];
  }),
});
