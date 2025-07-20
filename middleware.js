// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Match all routes except Next.js internals and static files
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//     // Include API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/", // Home page
  "/sign-in(.*)", // Sign-in routes
  "/sign-up(.*)", // Sign-up routes
  "/api(.*)", // API routes
]);

export default clerkMiddleware(async (auth, req) => {
  // Call auth() to get the resolved authentication object
  const { userId, redirectToSignIn } = await auth();

  // Allow public routes to bypass authentication
  if (isPublicRoute(req)) {
    return;
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Include API routes
    "/(api|trpc)(.*)",
  ],
};
