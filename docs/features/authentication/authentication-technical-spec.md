# Authentication Technical Specification

## Overview

This document provides technical details about the authentication implementation in the M-Yallow frontend application. The authentication system is built using Clerk, a complete user management and authentication solution that integrates with Next.js.

## Architecture

### Components

1. **ClerkProvider**: Root-level provider that manages authentication state
2. **Middleware**: Protects routes and handles redirects
3. **Authentication UI**: Components for sign-in, sign-up, and user profile
4. **Auth Hooks**: Client-side hooks for authentication state
5. **Server Utilities**: Server-side functions for authentication
6. **API Authentication**: JWT-based authentication for API requests

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Sign Up   │────▶│   Sign In   │────▶│  Protected  │
│    Page     │     │    Page     │     │   Routes    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   ▲
                           │                   │
                           ▼                   │
                    ┌─────────────┐     ┌─────────────┐
                    │    Clerk    │────▶│ Middleware  │
                    │   Session   │     │   Check     │
                    └─────────────┘     └─────────────┘
                           │                   ▲
                           │                   │
                           ▼                   │
                    ┌─────────────┐     ┌─────────────┐
                    │  JWT Token  │────▶│ API Routes  │
                    │             │     │             │
                    └─────────────┘     └─────────────┘
```

## Implementation Details

### Environment Variables

The following environment variables are required for Clerk integration:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
CLERK_WEBHOOK_SECRET=whsec_...
```

### Root Layout Integration

The `ClerkProvider` is integrated at the root layout level:

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ThemeProvider>
            {/* Application content */}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### Middleware Configuration

The middleware protects routes and handles redirects:

```tsx
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/protected(.*)'
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
  afterAuth(auth, req) {
    if (!auth.isAuthenticated && isProtectedRoute(req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### Sign-In Page

The sign-in page uses Clerk's `SignIn` component:

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-lg'
          }
        }}
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />
    </div>
  );
}
```

### Sign-Up Page

The sign-up page uses Clerk's `SignUp` component:

```tsx
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-lg'
          }
        }}
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
      />
    </div>
  );
}
```

### Header Integration

The header component integrates Clerk's authentication UI components:

```tsx
// components/layout/header.tsx
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

// Inside the header component
<SignedIn>
  <UserButton afterSignOutUrl="/" />
</SignedIn>
<SignedOut>
  <SignInButton mode="modal">
    <Button variant="ghost" size="sm">Sign in</Button>
  </SignInButton>
  <SignUpButton mode="modal">
    <Button variant="default" size="sm">Sign up</Button>
  </SignUpButton>
</SignedOut>
```

### Dashboard Page

The dashboard page is protected and displays user information:

```tsx
// app/dashboard/page.tsx
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName || 'User'}!</h2>
        <p className="text-muted-foreground mb-4">
          This is a protected dashboard page that requires authentication.
          You're seeing this because you're successfully signed in.
        </p>
        
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Your Account Information</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">Email:</span> {user?.emailAddresses[0]?.emailAddress}</li>
            <li><span className="font-medium">User ID:</span> {user?.id}</li>
            <li><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

### Protected API Route

API routes are protected using Clerk's auth helper:

```tsx
// app/api/protected/user/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Here you would typically fetch user data from your database
  return NextResponse.json({
    userId,
    message: 'This is protected data from the API'
  });
}
```

### Authentication Redirect Hook

A custom hook for client-side authentication redirects:

```tsx
// hooks/auth/use-auth-redirect.ts
'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect(redirectUrl: string = '/sign-in') {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectUrl);
    }
  }, [isLoaded, isSignedIn, router, redirectUrl]);
  
  return { isLoaded, isSignedIn };
}
```

### Authentication Token Utility

A utility function to get the authentication token for API requests:

```tsx
// lib/auth/index.ts
import { auth } from '@clerk/nextjs/server';

export async function getAuthToken() {
  const { getToken } = auth();
  return await getToken();
}
```

### API Client

An API client that uses the authentication token:

```tsx
// lib/api-client.ts
import { getAuthToken } from './auth';
import axios from 'axios';

export async function createApiClient() {
  const token = await getAuthToken();
  
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}

// Client-side version using Clerk's useAuth hook
export function createClientApiClient(token?: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}
```

## Security Considerations

### JWT Token Security

Clerk handles JWT token security with the following features:

- Short-lived tokens with automatic refresh
- Secure token storage in HTTP-only cookies
- CSRF protection
- Token revocation on sign-out

### Route Protection

Routes are protected using middleware, which:

- Verifies the authentication state
- Redirects unauthenticated users
- Supports public routes

### API Authentication

API routes are protected by:

- Verifying the JWT token
- Checking user permissions
- Returning appropriate error responses

## Performance Considerations

### Server-Side Rendering

Clerk supports server-side rendering with:

- Server components integration
- Middleware for route protection
- Server-side authentication checks

### Client-Side Performance

Client-side performance is optimized with:

- Minimal bundle size
- Efficient token refresh
- Caching of user data

## Future Enhancements

1. **Social Authentication**: Add support for Google, GitHub, etc.
2. **Multi-Factor Authentication**: Implement 2FA for enhanced security
3. **Role-Based Access Control**: Add role-based permissions
4. **User Profile Management**: Allow users to update their profiles
5. **Webhook Handlers**: Handle user events with webhooks

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Authentication](https://jwt.io/introduction)
