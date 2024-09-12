import authConfig from "auth.config";
import NextAuth, { Session } from "next-auth";
import { publicRoutes, apiAuthPrefix, authRoutes } from "@/server/routes";
import { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const DEFAULT_PROTECTED_ROUTE = "/dashboard";

export default auth(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiRoute = apiAuthPrefix.includes(nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiRoute) {
      return;
    }

    if (!isLoggedIn && isPublicRoute) {
      return;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_PROTECTED_ROUTE, nextUrl));
      }

      return;
    }

    if (!isLoggedIn && !isAuthRoute) {
      return Response.redirect(new URL("/auth", nextUrl));
    }

    return;
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
