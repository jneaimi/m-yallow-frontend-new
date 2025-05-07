'use client';

import { createClientApiClient } from '@/lib/api-client';
import { useAuthToken, useAuthUserId } from '@/lib/auth/client';
import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

/**
 * Hook that provides a stable function to get an API client for client components
 * with enhanced error handling and token validation
 */
export function useApiClient() {
  const getToken = useAuthToken(); // This returns a stable function reference
  const getUserId = useAuthUserId(); // Get the user ID function
  const { isSignedIn } = useAuth(); // Add useAuth to check authentication state

  // Wrap the async function in useCallback to stabilize its reference
  const getApiClient = useCallback(async () => {
    try {
      // Only attempt to get a token if the user is signed in
      if (!isSignedIn) {
        console.warn('Attempting to get API client while not signed in');
        // Return a client without auth token for public endpoints
        return createClientApiClient(undefined);
      }
      
      // Get the token and validate it's not empty
      const token = await getToken();
      const userId = getUserId();
      
      if (!token) {
        console.warn('No auth token available despite user being signed in');
        throw new Error('Authentication token not available. Please sign in again.');
      }
      
      return createClientApiClient(token, userId || undefined);
    } catch (error) {
      console.error('Error creating API client:', error);
      // For token errors, throw a more user-friendly error
      if (error instanceof Error && error.message.includes('auth')) {
        throw new Error('Your session appears to have expired. Please sign in again.');
      }
      throw error;
    }
  }, [getToken, getUserId, isSignedIn]); // Dependencies: the stable getToken function and auth state

  return getApiClient;
}
