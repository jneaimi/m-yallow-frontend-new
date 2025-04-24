/**
 * Server-side authentication utilities for Clerk integration
 * These functions should only be used in server components or API routes
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Get the current authentication status
 * @returns Object containing auth status and userId
 */
export function getAuthStatus() {
  const { userId } = auth();
  return {
    isAuthenticated: !!userId,
    userId
  };
}

/**
 * Require authentication for a route
 * Redirects to sign-in page if user is not authenticated
 * @param redirectUrl Optional custom redirect URL
 * @returns The current userId if authenticated
 */
export async function requireAuth(redirectUrl?: string) {
  const { userId } = auth();
  
  if (!userId) {
    const signInUrl = redirectUrl || '/sign-in';
    redirect(signInUrl);
  }
  
  return userId;
}

/**
 * Get detailed user data for the authenticated user
 * @returns User data object or null if not authenticated
 */
export async function getUserData() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || '',
    emailAddress: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
  };
}

/**
 * Check if the current user has the specified role
 * @param role The role to check
 * @returns Boolean indicating if the user has the role
 */
export async function hasRole(role: string) {
  const user = await currentUser();
  
  if (!user) {
    return false;
  }
  
  // This is a placeholder - implement your role checking logic
  // based on your specific Clerk setup (e.g., using publicMetadata)
  const userRoles = user.publicMetadata?.roles as string[] || [];
  return userRoles.includes(role);
}

// Type definitions
export type AuthStatus = {
  isAuthenticated: boolean;
  userId: string | null;
};

export type UserData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  emailAddress: string | undefined;
  imageUrl: string;
  createdAt: Date;
};
