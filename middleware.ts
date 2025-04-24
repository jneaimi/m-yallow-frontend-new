import { clerkMiddleware } from "@clerk/nextjs/server";

// Define routes that don't require authentication
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/accessibility-test(.*)",
  "/responsive-demo(.*)",
  "/theme-demo(.*)",
];

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except the public ones
  if (
    !publicRoutes.some((pattern) => {
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(req.nextUrl.pathname);
    })
  ) {
    await auth.protect();
  }
});

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
