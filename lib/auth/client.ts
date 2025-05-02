'use client';

// Removed duplicate import and commented out redundant JSDoc
import { useAuth } from '@clerk/nextjs'; 
import { useCallback } from 'react';

/**
 * Client-side hook for getting the authentication token
 * @returns A stable function that returns the current auth token
 */
export function useAuthToken() {
  const { getToken } = useAuth(); // Use original destructuring

  // Wrap the async function in useCallback to stabilize its reference
  const memoizedGetToken = useCallback(async () => { // Rename the memoized function
    try {
      return await getToken(); // Use original getToken from useAuth
    } catch (error) {
      console.error('Failed to retrieve auth token on client:', error);
      return null;
    }
  }, [getToken]); // Dependency is the original getToken

  return memoizedGetToken; // Return the memoized function
}
