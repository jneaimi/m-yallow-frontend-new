import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/accessibility-test(.*)',
  '/responsive-demo(.*)',
  '/theme-demo(.*)',
];

// Check if the path matches any public paths
const isPublic = (path: string) => {
  return publicPaths.find((publicPath) => {
    const regex = new RegExp(`^${publicPath}$`);
    return regex.test(path);
  });
};

export default function middleware(request: NextRequest) {
  const { userId } = getAuth(request);
  const { pathname } = request.nextUrl;

  // If the path is public, allow access
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // If there's no user ID and the path isn't public, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
