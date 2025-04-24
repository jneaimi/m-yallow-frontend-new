/**
 * Client-side authentication utilities for Clerk integration
 * These functions can be used in client components
 */

'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

/**
 * Hook to get the current authentication status
 * @returns Object with auth status information
 */
export function useAuthStatus() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  
  return {
    isLoaded,
    isAuthenticated: isLoaded && isSignedIn,
    userId: userId || null,
    isLoading: !isLoaded
  };
}

/**
 * Hook to get the current user data
 * @returns Object with user data and loading state
 */
export function useUserData() {
  const { isLoaded, user } = useUser();
  
  if (!isLoaded || !user) {
    return {
      user: null,
      isLoading: !isLoaded
    };
  }
  
  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName || '',
      emailAddress: user.primaryEmailAddress?.emailAddress,
      imageUrl: user.imageUrl,
    },
    isLoading: false
  };
}

/**
 * Hook to handle authentication-aware navigation
 * @returns Navigation functions that respect authentication
 */
export function useAuthNavigation() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
  const navigateIfAuthenticated = (url: string, fallbackUrl: string = '/sign-in') => {
    if (isSignedIn) {
      router.push(url);
    } else {
      router.push(fallbackUrl);
    }
  };
  
  const navigateIfUnauthenticated = (url: string, fallbackUrl: string = '/dashboard') => {
    if (!isSignedIn) {
      router.push(url);
    } else {
      router.push(fallbackUrl);
    }
  };
  
  return {
    navigateIfAuthenticated,
    navigateIfUnauthenticated
  };
}

/**
 * Announce authentication state changes to screen readers
 * @param message The message to announce
 */
export function announceAuthStateChange(message: string) {
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) {
    announcer.textContent = message;
  }
}

// Type definitions
export type ClientAuthStatus = {
  isLoaded: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
};

export type ClientUserData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  emailAddress: string | undefined;
  imageUrl: string;
};
