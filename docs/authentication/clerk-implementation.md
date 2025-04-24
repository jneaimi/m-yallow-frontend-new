# Clerk Authentication Implementation Guide

This document provides an overview of the Clerk authentication implementation in the M-Yallow frontend application.

## Overview

Clerk has been integrated into the Next.js application to provide user authentication services. The implementation includes:

1. ClerkProvider setup in the root layout
2. Environment variable configuration
3. Server-side authentication utilities
4. Client-side authentication utilities
5. Accessibility enhancements for authentication flows

## ClerkProvider Setup

The ClerkProvider has been added to the root layout (`app/layout.tsx`) to wrap the entire application:

```tsx
<ClerkProvider
  appearance={{
    elements: {
      formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      card: 'bg-background border border-border shadow-md',
      // Additional styling configuration
    },
  }}
>
  {/* Application content */}
</ClerkProvider>
```

The appearance configuration applies our application's design system to Clerk's authentication components, ensuring a consistent user experience.

## Environment Variables

The following environment variables are required for Clerk authentication:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

For detailed information on environment variables, see [Environment Variables Documentation](./environment-variables.md).

## Authentication Utilities

### Server-Side Utilities

Server-side authentication utilities are located in `lib/auth/server.ts` and include:

- `getAuthStatus`: Get the current authentication status
- `requireAuth`: Require authentication for a route
- `getUserData`: Get detailed user data
- `hasRole`: Check if the current user has a specific role

Example usage in a server component:

```tsx
import { getUserData } from '@/lib/auth';

export default async function ProfilePage() {
  const userData = await getUserData();
  
  if (!userData) {
    return <div>Please sign in to view your profile</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {userData.firstName}</h1>
      {/* Additional profile content */}
    </div>
  );
}
```

### Client-Side Utilities

Client-side authentication utilities are located in `lib/auth/client.ts` and include:

- `useAuthStatus`: Hook to get the current authentication status
- `useUserData`: Hook to get the current user data
- `useAuthNavigation`: Hook for authentication-aware navigation
- `announceAuthStateChange`: Function to announce auth state changes to screen readers

Example usage in a client component:

```tsx
'use client';

import { useUserData } from '@/lib/auth/client';

export function UserProfile() {
  const { user, isLoading } = useUserData();
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  
  if (!user) {
    return <div>Please sign in to view your profile</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}</h1>
      {/* Additional profile content */}
    </div>
  );
}
```

## Accessibility Features

Authentication flows have been enhanced with accessibility features:

1. **Screen Reader Announcements**:
   - Authentication state changes are announced using live regions
   - Form errors and successes are announced to screen readers

2. **Keyboard Navigation**:
   - Authentication forms support keyboard navigation
   - Focus management during authentication flows

3. **ARIA Attributes**:
   - Forms have proper ARIA attributes for labels and descriptions
   - Error messages are properly associated with form fields

### Accessibility Utilities

Authentication-specific accessibility utilities are located in `lib/accessibility/auth.ts` and include:

- `announceAuthStateChange`: Announce auth state changes to screen readers
- `manageFocusAfterAuthAction`: Manage focus after authentication actions
- `getAuthFormProps`: Get ARIA attributes for authentication forms
- `getAuthErrorProps`: Get ARIA attributes for authentication error messages
- `getAuthSuccessProps`: Get ARIA attributes for authentication success messages
- `handleAuthFormKeyboardNavigation`: Handle keyboard navigation for authentication forms

Example usage in an authentication form component:

```tsx
'use client';

import { 
  getAuthFormProps, 
  getAuthErrorProps, 
  manageFocusAfterAuthAction 
} from '@/lib/accessibility/auth';

export function SignInForm() {
  const formId = 'sign-in-form';
  const emailInputId = 'sign-in-email';
  
  // Form state and submission logic
  
  // Handle successful sign-in
  const handleSuccess = () => {
    // Other success handling
    
    // Announce success to screen readers
    announceAuthStateChange('Sign in successful');
    
    // Manage focus after sign in
    manageFocusAfterAuthAction('dashboard-heading', 'main h1');
  };
  
  return (
    <form 
      {...getAuthFormProps(formId)}
      onSubmit={handleSubmit}
    >
      <h2 id={`${formId}-heading`}>Sign In</h2>
      <p id={`${formId}-description`}>Sign in to access your account</p>
      
      <div>
        <label htmlFor={emailInputId}>Email</label>
        <input 
          id={emailInputId}
          type="email"
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? `${emailInputId}-error` : undefined}
        />
        {errors.email && (
          <div {...getAuthErrorProps(emailInputId)}>
            {errors.email.message}
          </div>
        )}
      </div>
      
      {/* Additional form fields */}
      
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## AuthStateAnnouncer Component

A special `AuthStateAnnouncer` component has been added to announce authentication state changes to screen readers:

```tsx
// From components/auth/auth-state-announcer.tsx
export function AuthStateAnnouncer() {
  const { isLoaded, isSignedIn } = useAuth();
  const [prevSignedIn, setPrevSignedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Announce changes to authentication state
    if (isLoaded && prevSignedIn !== null && prevSignedIn !== isSignedIn) {
      const message = isSignedIn 
        ? 'You have successfully signed in'
        : 'You have been signed out';
        
      const announcer = document.getElementById('auth-state-announcer');
      if (announcer) {
        announcer.textContent = message;
      }
    }
    
    if (isLoaded) {
      setPrevSignedIn(isSignedIn);
    }
  }, [isLoaded, isSignedIn, prevSignedIn]);
  
  return (
    <LiveRegion
      id="auth-state-announcer"
      politeness="polite"
      className="sr-only"
      aria-atomic="true"
    />
  );
}
```

This component has been added to the root layout to ensure authentication state changes are announced to screen readers.

## Implementation Checklist

- [x] Configure environment variables for Clerk authentication
- [x] Integrate ClerkProvider in the root layout
- [x] Create server-side authentication utility functions
- [x] Create client-side authentication utility functions
- [x] Implement accessibility enhancements for authentication flows
- [x] Add AuthStateAnnouncer component for screen reader announcements

## Next Steps

1. **Create Authentication Pages**:
   - Create sign-in page
   - Create sign-up page
   - Create password reset page

2. **Implement Protected Routes**:
   - Set up middleware for route protection
   - Create user profile page
   - Create account settings page

3. **Add User Management**:
   - Create user list for admins
   - Implement role-based access control
   - Add user management interface

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
