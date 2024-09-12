/**
 * Public routes
 *
 * Routes that do not require authentication
 *
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * auth routes
 *
 * Routes that authenticates users.
 * Already authenticated users will be redirected away from this route.
 *
 * @type {string[]}
 */
export const authRoutes = ["/auth"];

/**
 * api routes
 *
 * Routes that do not require authentication
 *
 * @type {string}
 */
export const apiAuthPrefix = ["/api/auth", "/api/uploadthing"];
