# Authentication Guide

## Overview

This guide provides an overview of the authentication system in the M-Yallow frontend application. It covers the key concepts, components, and usage patterns for implementing and working with authentication.

## Key Concepts

### Authentication Provider

The authentication system is built using Clerk, a complete user management and authentication solution that integrates with Next.js. Clerk provides:

- User authentication (sign-up, sign-in, sign-out)
- Session management
- JWT tokens for API authentication
- User profile management
- Social authentication (future enhancement)

### Authentication Flow

The authentication flow consists of the following steps:

1. **User Registration**: Users create an account with email/password or social providers
2. **User Authentication**: Users sign in with their credentials
3. **Session Management**: Clerk manages the user's session with secure cookies
4. **Protected Routes**: Middleware protects routes that require authentication
5. **API Authentication**: JWT tokens authenticate API requests

### Authentication Components

Clerk provides several components for authentication:

- `SignIn`: Complete sign-in form
- `SignUp`: Complete sign-up form
- `SignInButton`: Button to trigger sign-in
- `SignUpButton`: Button to trigger sign-up
- `UserButton`: User profile and sign-out button
- `SignedIn`: Wrapper to show content only to signed-in users
- `SignedOut`: Wrapper to show content only to signed-out users

## Implementation

### Project Structure

The authentication system is implemented across several files:

```
├── app/
│   ├── layout.tsx              # ClerkProvider integration
│   ├── sign-in/                # Sign-in page
│   ├── sign-up/                # Sign-up page
│   └── dashboard/              # Protected dashboard page
├── middleware.ts               # Route protection
├── components/
│   └── layout/
│       └── header.tsx          # Authentication UI
├── hooks/
│   └── auth/
│       └── use-auth-redirect.ts # Authentication redirect hook
└── lib/
    ├── auth/
    │   └── index.ts            # Authentication utilities
    └── api-client.ts           # API client with authentication
```

### Setup Steps

1. **Environment Variables**: Set up Clerk environment variables in `.env.local`
2. **ClerkProvider**: Wrap the application with `ClerkProvider` in the root layout
3. **Middleware**: Configure middleware to protect routes
4. **Authentication Pages**: Create sign-in and sign-up pages
5. **Header Integration**: Add authentication UI to the header
6. **Protected Routes**: Create protected routes like the dashboard
7. **API Authentication**: Implement JWT authentication for API routes

## Usage Guidelines

### Authentication State

#### Client Components

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

#### Server Components

In server components, use Clerk's server functions:

```tsx
import { currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) return <div>Not signed in</div>;
  
  return <div>Hello, {user.firstName}!</div>;
}
```

### Protected Routes

#### Middleware Protection

Routes are protected using middleware:

```tsx
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/public(.*)'
  ],
});
```

#### Manual Protection

For more granular control, you can manually protect routes:

```tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return <div>Protected content</div>;
}
```

### API Authentication

#### Protected API Routes

API routes are protected using the `auth` function:

```tsx
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
  
  return NextResponse.json({
    userId,
    message: 'This is protected data'
  });
}
```

#### API Client

Use the authentication token in API requests:

```tsx
import { getAuthToken } from '@/lib/auth';
import axios from 'axios';

export async function fetchProtectedData() {
  const token = await getAuthToken();
  
  const response = await axios.get('/api/protected/data', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
}
```

## Best Practices

### Security

1. **Always use middleware** to protect routes that require authentication
2. **Verify authentication in API routes** to prevent unauthorized access
3. **Use server components** for sensitive operations
4. **Don't expose sensitive user data** to the client

### Performance

1. **Use server components** when possible to reduce client-side JavaScript
2. **Implement loading states** for authentication operations
3. **Cache user data** to reduce API calls

### User Experience

1. **Provide clear feedback** during authentication operations
2. **Implement proper redirects** after authentication
3. **Handle loading states** to prevent UI flashes
4. **Ensure accessibility** for authentication forms

## Troubleshooting

### Common Issues

1. **Middleware not working**: Ensure the middleware file is in the correct location and the matcher is configured properly
2. **Authentication state not updating**: Check that `ClerkProvider` is properly set up in the root layout
3. **API routes not protected**: Verify that the `auth` function is being used correctly
4. **Redirects not working**: Check that the redirect URLs are configured properly

### Debugging

1. **Check environment variables**: Ensure all required Clerk environment variables are set
2. **Inspect network requests**: Look for authentication-related requests in the browser's network tab
3. **Check Clerk logs**: Review the Clerk dashboard for authentication events
4. **Use development tools**: Clerk provides development tools for debugging

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Authentication](https://jwt.io/introduction)
- [Authentication Examples](./authentication-examples.md)
- [Technical Specification](./authentication-technical-spec.md)
