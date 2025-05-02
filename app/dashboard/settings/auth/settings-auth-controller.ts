'use client';

import { redirect } from 'next/navigation';

/**
 * Settings authentication utilities
 * Handles authentication logic for settings pages
 * Implemented as standalone functions for better modularity and tree-shaking
 */
/**
 * Check if the user is authenticated and redirect if not
 * @param isLoaded Whether the auth state is loaded
 * @param isSignedIn Whether the user is signed in
 * @returns Boolean indicating if rendering should continue
 */
export function checkAuthentication(isLoaded: boolean, isSignedIn: boolean): boolean {
  // Bail out immediately if the auth state is loaded and the user is not signed-in
  if (isLoaded && !isSignedIn) {
    redirect('/sign-in');
    return false;
  }
  
  return true;
}

/**
 * Check if the page is still loading
 * @param isAuthLoaded Whether auth data is loaded
 * @param isUserLoading Whether user data is loading 
 * @returns Boolean indicating if the page is still loading
 */
export function isLoading(isAuthLoaded: boolean, isUserLoading: boolean): boolean {
  return !isAuthLoaded || isUserLoading;
}
