import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";

import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import authConfig from "auth.config";
import { eq } from "drizzle-orm";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
          },
        };
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, token.sub!),
      });

      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id!));
    },
  },
  session: { strategy: "jwt" },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  ...authConfig,
});
