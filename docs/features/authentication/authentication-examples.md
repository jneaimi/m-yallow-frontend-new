# Authentication Usage Examples

This document provides practical examples of how to use the authentication system in the M-Yallow frontend application. These examples cover common authentication scenarios and patterns.

## Table of Contents

1. [Basic Authentication](#basic-authentication)
2. [Protected Routes](#protected-routes)
3. [User Information](#user-information)
4. [Conditional Rendering](#conditional-rendering)
5. [API Authentication](#api-authentication)
6. [Custom Redirects](#custom-redirects)
7. [Authentication Hooks](#authentication-hooks)

## Basic Authentication

### Sign-In Component

Use the `SignIn` component to create a sign-in page:

```tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
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

### Sign-Up Component

Use the `SignUp` component to create a sign-up page:

```tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
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

### Sign-In Button

Use the `SignInButton` component to create a sign-in button:

```tsx
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function SignInButtonExample() {
  return (
    <SignInButton mode="modal">
      <Button variant="default">Sign in</Button>
    </SignInButton>
  );
}
```

### User Button

Use the `UserButton` component to display the user's profile and sign-out option:

```tsx
import { UserButton } from '@clerk/nextjs';

export default function UserButtonExample() {
  return (
    <UserButton afterSignOutUrl="/" />
  );
}
```

## Protected Routes

### Middleware Protection

Use middleware to protect routes:

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

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### Client-Side Protection

Use the `useAuth` hook to protect client components:

```tsx
'use client';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedClientComponent() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);
  
  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }
  
  return <div>Protected content</div>;
}
```

### Server-Side Protection

Use the `auth` function to protect server components:

```tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProtectedServerComponent() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  const user = await currentUser();
  
  return <div>Hello, {user?.firstName}!</div>;
}
```

## User Information

### Client-Side User Information

Use the `useUser` hook to access user information in client components:

```tsx
'use client';
import { useUser } from '@clerk/nextjs';

export default function UserProfile() {
  const { isLoaded, user } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user?.firstName} {user?.lastName}</p>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

### Server-Side User Information

Use the `currentUser` function to access user information in server components:

```tsx
import { currentUser } from '@clerk/nextjs/server';

export default async function ServerUserProfile() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Not signed in</div>;
  }
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

## Conditional Rendering

### Signed-In and Signed-Out Components

Use the `SignedIn` and `SignedOut` components to conditionally render content:

```tsx
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function ConditionalContent() {
  return (
    <div>
      <SignedIn>
        <p>This content is only visible to signed-in users.</p>
      </SignedIn>
      <SignedOut>
        <p>This content is only visible to signed-out users.</p>
      </SignedOut>
    </div>
  );
}
```

### Conditional Rendering with Hooks

Use the `useAuth` hook to conditionally render content in client components:

```tsx
'use client';
import { useAuth } from '@clerk/nextjs';

export default function ConditionalClientContent() {
  const { isSignedIn } = useAuth();
  
  return (
    <div>
      {isSignedIn ? (
        <p>This content is only visible to signed-in users.</p>
      ) : (
        <p>This content is only visible to signed-out users.</p>
      )}
    </div>
  );
}
```

## API Authentication

### Protected API Route

Use the `auth` function to protect API routes:

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

### API Client with Authentication

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

## Custom Redirects

### Custom Redirect After Sign-In

Use the `redirectUrl` prop to customize the redirect after sign-in:

```tsx
import { SignIn } from '@clerk/nextjs';

export default function CustomRedirectSignIn() {
  return (
    <SignIn
      redirectUrl="/dashboard"
    />
  );
}
```

### Dynamic Redirect Based on User Role

Use the `afterSignInUrl` callback to dynamically redirect based on user role:

```tsx
import { SignIn } from '@clerk/nextjs';

export default function RoleBasedRedirectSignIn() {
  return (
    <SignIn
      afterSignInUrl={(user) => {
        // Check user metadata for role
        const role = user.publicMetadata.role;
        
        if (role === 'admin') {
          return '/admin/dashboard';
        }
        
        return '/dashboard';
      }}
    />
  );
}
```

## Authentication Hooks

### Custom Authentication Hook

Create a custom hook for authentication state:

```tsx
'use client';
import { useAuth, useUser } from '@clerk/nextjs';

export function useAuthStatus() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  
  const isLoaded = isAuthLoaded && isUserLoaded;
  
  return {
    isLoaded,
    isAuthenticated: isSignedIn,
    user: isSignedIn ? user : null
  };
}
```

### Authentication Redirect Hook

Create a hook for authentication redirects:

```tsx
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

### Loading State Hook

Create a hook for handling loading states during authentication:

```tsx
'use client';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export function useAuthLoading() {
  const { isLoaded } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (isLoaded) {
      // Add a small delay to prevent flash of content
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);
  
  return { isReady: isLoaded && isReady };
}
```

## Conclusion

These examples demonstrate how to use the authentication system in various scenarios. For more advanced use cases, refer to the [Clerk documentation](https://clerk.com/docs) or the [technical specification](./authentication-technical-spec.md).
