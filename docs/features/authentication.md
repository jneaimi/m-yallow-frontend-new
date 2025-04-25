# Authentication Implementation

## Overview

This document provides an overview of the authentication implementation for the M-Yallow frontend application. The authentication system is built using Clerk, a complete user management and authentication solution that integrates seamlessly with Next.js.

## Implementation Status

### Completed
- ✅ Clerk integration with Next.js
- ✅ Sign-in, sign-up, and sign-out flows
- ✅ Protected routes with middleware
- ✅ JWT token for API requests
- ✅ User profile display
- ✅ Authentication state management

### In Progress
- 🔄 User profile management
- 🔄 Role-based access control

### Pending
- ⏳ Social authentication providers
- ⏳ Multi-factor authentication
- ⏳ Webhook handlers for user events

## Documentation Resources

We've created several documents to guide the implementation:

1. [Authentication Guide](./authentication/authentication-guide.md) - Overview of the authentication implementation
2. [Technical Specification](./authentication/authentication-technical-spec.md) - Technical details of the implementation
3. [Usage Examples](./authentication/authentication-examples.md) - Practical examples of authentication patterns

## Key Components

### ClerkProvider

The `ClerkProvider` is integrated at the root layout level to provide authentication context throughout the application:

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

### Authentication Middleware

The middleware protects routes and redirects unauthenticated users:

```tsx
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    // Other public routes
  ],
  // Custom logic for route protection
});
```

### Authentication UI Components

The header component integrates Clerk's authentication UI components:

```tsx
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

// Inside the header component
<SignedIn>
  <UserButton afterSignOutUrl="/" />
</SignedIn>
<SignedOut>
  <SignInButton mode="modal">
    <Button>Sign in</Button>
  </SignInButton>
</SignedOut>
```

### Protected API Routes

API routes are protected using Clerk's auth helper:

```tsx
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
  
  // Protected logic
}
```

## Authentication Flow

1. **Sign Up**: Users can create an account via `/sign-up` or the sign-up modal
2. **Sign In**: Users can sign in via `/sign-in` or the sign-in modal
3. **Protected Routes**: Authenticated users can access protected routes like `/dashboard`
4. **API Authentication**: Protected API routes verify the user's JWT token
5. **Sign Out**: Users can sign out using the UserButton component

## Requirements Fulfillment

The implementation addresses all aspects of FR-01.3:

### FR-01.3: Set Up Clerk Authentication
**Purpose:** Enable secure authentication for users and admins.

**Processing:**
- ✅ Integrated Clerk with Next.js
- ✅ Implemented sign-in, sign-up, sign-out flows
- ✅ Protected dashboard/admin routes with Clerk middleware
- ✅ Store and provide Clerk JWT for API requests

**Acceptance:**
- ✅ Users can sign up, sign in, sign out
- ✅ Protected routes redirect unauthenticated users
- ✅ JWT token available for API calls

## How to Use

### Client Components

In client components, use Clerk's hooks to access authentication state:

```tsx
'use client';
import { useAuth, useUser } from '@clerk/nextjs';

export default function ProfileButton() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  if (!isSignedIn) return null;
  
  return <div>Hello, {user.firstName}!</div>;
}
```

### Server Components

In server components, use Clerk's server functions:

```tsx
import { currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) return <div>Not signed in</div>;
  
  return <div>Hello, {user.firstName}!</div>;
}
```

### API Routes

In API routes, use the auth helper:

```tsx
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    // Handle unauthorized
  }
  
  // Handle authorized request
}
```

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Authentication](https://jwt.io/introduction)
