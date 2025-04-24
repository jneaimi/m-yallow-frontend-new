import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUnauthorizedResponse } from "./lib/auth/jwt";

// Define routes that don't require authentication
const publicRoutes = [
  // Public pages
  "/",
  "/about",
  "/contact",
  "/pricing",
  
  // Authentication routes
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  
  // API webhooks and public endpoints
  "/api/webhooks(.*)",
  "/api/public(.*)",
  
  // Demo and test pages
  "/accessibility-test(.*)",
  "/responsive-demo(.*)",
  "/theme-demo(.*)",
];

// API routes that require JWT authentication
const apiRoutes = [
  "/api/(.*)(?<!public|webhooks)(.*)",
];

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(pattern => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
  
  // Check if the route is an API route requiring JWT
  const isApiRoute = apiRoutes.some(pattern => {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
  
  // Handle API routes with JWT authentication
  if (isApiRoute) {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Return proper error response for missing/invalid token
      return createUnauthorizedResponse("Please provide a valid authentication token");
    }
    
    // Validate JWT token (Clerk handles this internally)
    try {
      await auth.protect();
      return NextResponse.next();
    } catch (error) {
      // Return proper error for invalid token
      return createUnauthorizedResponse("Your session has expired or is invalid");
    }
  }
  
  // For non-public, non-API routes, protect with standard auth
  if (!isPublicRoute) {
    try {
      await auth.protect();
    } catch (error) {
      // Store the original URL for post-authentication redirect
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      
      // Add parameters for accessibility
      signInUrl.searchParams.set("manage_focus", "true");
      signInUrl.searchParams.set("announce", "auth_required");
      
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
});

// Configure middleware matcher
export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Match root path
    "/",
    // Match API routes
    "/(api|trpc)(.*)"
  ],
};
