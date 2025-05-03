import { clerkMiddleware } from '@clerk/nextjs/server';

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
