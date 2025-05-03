import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/protected(.*)'
]);

// Define auth routes
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/public(.*)',
    '/accessibility-test(.*)',
    '/responsive-demo(.*)',
    '/theme-demo(.*)'
  ],
  // Disable all afterAuth redirects to prevent loops
  afterAuth(auth, req) {
    // Skip all redirects for now to prevent loops
    return;
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
