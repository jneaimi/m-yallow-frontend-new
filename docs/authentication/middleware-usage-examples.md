# Clerk Middleware Usage Examples

This document provides examples of how to work with the Clerk Middleware implementation in the M-Yallow frontend application.

## Table of Contents

1. [Handling Redirects in Authentication Pages](#handling-redirects-in-authentication-pages)
2. [Working with Protected API Routes](#working-with-protected-api-routes)
3. [Creating New Protected Routes](#creating-new-protected-routes)
4. [Customizing Public Routes](#customizing-public-routes)
5. [Accessibility Best Practices](#accessibility-best-practices)

## Handling Redirects in Authentication Pages

When a user is redirected to an authentication page from a protected route, the middleware adds parameters to the URL. Here's how to handle these parameters in your authentication pages:

### Example: Sign-In Page with Redirect Handling

```tsx
'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AuthRedirectHandler, useRedirectUrl } from '@/components/auth/redirect-handler';

export default function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Get the redirect URL from search parameters
  const redirectUrl = useRedirectUrl();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // Redirect to the original URL or dashboard
        router.push(redirectUrl || '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    }
  };
  
  return (
    <div>
      {/* Include the redirect handler component */}
      <AuthRedirectHandler />
      
      <h1>Sign In</h1>
      
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="sign-in-email">Email</label>
          <input
            id="sign-in-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="sign-in-password">Password</label>
          <input
            id="sign-in-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        
        <button type="submit" disabled={!isLoaded}>
          Sign In
        </button>
      </form>
      
      {redirectUrl && (
        <p aria-live="polite">
          You'll be redirected to your requested page after signing in.
        </p>
      )}
    </div>
  );
}
```

## Working with Protected API Routes

When creating API routes that should be protected by the middleware, you need to ensure they handle authentication correctly.

### Example: Protected API Route

```typescript
// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  // The middleware will already have validated the JWT token
  // We can safely use the auth() function to get the user ID
  const { userId } = auth();
  
  if (!userId) {
    // This should not happen if middleware is working correctly,
    // but it's good to have a fallback
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Fetch user data from your database or service
  const userData = await fetchUserData(userId);
  
  return NextResponse.json(userData);
}

async function fetchUserData(userId: string) {
  try {
    // Implementation of fetching user data
    return {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      // Other user data
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to retrieve user data');
  }
}
```

### Example: Client-Side API Call with JWT

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function UserProfile() {
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Get the JWT token from Clerk
        const token = await getToken();
        
        // Make the API request with the token
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [getToken]);
  
  if (loading) {
    return <div>Loading profile...</div>;
  }
  
  if (error) {
    return <div role="alert">{error}</div>;
  }
  
  return (
    <div>
      <h1>User Profile</h1>
      {userData && (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* Other user data */}
        </div>
      )}
    </div>
  );
}
```

## Creating New Protected Routes

When creating new routes in your application, they will be protected by default unless they match one of the public route patterns defined in the middleware.

### Example: Protected Dashboard Page

```tsx
// app/dashboard/page.tsx
import { getUserData } from '@/lib/auth/server';

> **Implementation:** see [`getUserData`](../../../lib/auth/server.ts#L42) for full definition.

export default async function DashboardPage() {
  // This will be protected by the middleware
  // If the user is not authenticated, they will be redirected to sign-in
  const userData = await getUserData();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userData?.firstName || 'User'}!</p>
      {/* Dashboard content */}
    </div>
  );
}
```

## Customizing Public Routes

If you need to add new public routes to your application, you should update the `publicRoutes` array in the middleware configuration.

### Example: Adding a New Public Route

To add a new public route, update the `publicRoutes` array in `middleware.ts`:

```typescript
// middleware.ts
const publicRoutes = [
  // Existing public routes...
  
  // Add your new public route
  "/faq(.*)",
  "/terms-of-service",
  "/privacy-policy",
];
```

## Accessibility Best Practices

When working with authentication and protected routes, it's important to follow accessibility best practices to ensure all users can navigate your application effectively.

### Example: Accessible Authentication Error Handling

```tsx
'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { announceAuthRedirect } from '@/lib/accessibility/auth-redirects';

export function SignInForm() {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // Announce success to screen readers
        announceAuthRedirect('Sign in successful. Redirecting to your account.', 'polite');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      
      // Announce error to screen readers
      announceAuthRedirect(`Sign in failed: ${err.message || 'Please check your credentials.'}`, 'assertive');
      
      // Focus the first field with an error
      document.getElementById('sign-in-email')?.focus();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} aria-describedby={error ? 'sign-in-error' : undefined}>
      {error && (
        <div id="sign-in-error" role="alert" className="error">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="sign-in-email">Email</label>
        <input
          id="sign-in-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
        />
      </div>
      
      <div>
        <label htmlFor="sign-in-password">Password</label>
        <input
          id="sign-in-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
        />
      </div>
      
      <button type="submit">
        Sign In
      </button>
    </form>
  );
}
```

### Example: Accessible Loading States

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export function SignOutButton() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      await signOut();
      
      // Announce sign out to screen readers
      announceAuthRedirect('You have been signed out successfully.', 'polite');
    } catch (error) {
      console.error('Sign out failed', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      aria-busy={loading}
      className="sign-out-button"
    >
      {loading ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}
```

## Conclusion

These examples demonstrate how to work with the Clerk Middleware implementation in various scenarios. By following these patterns, you can ensure that your application's authentication flows are secure, accessible, and user-friendly.

Remember to always consider accessibility when implementing authentication features, as this ensures that all users can navigate your application effectively, regardless of their abilities or the assistive technologies they use.
