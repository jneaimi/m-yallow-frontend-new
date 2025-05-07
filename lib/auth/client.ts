'use client';

import { useAuth } from '@clerk/nextjs'; 
import { useUser } from '@clerk/nextjs';
import { useCallback } from 'react';

/**
 * Client-side hook for getting the authentication token
 * @returns A stable function that returns the current auth token
 */
export function useAuthToken() {
  const { getToken } = useAuth();

  // Wrap the async function in useCallback to stabilize its reference
  const memoizedGetToken = useCallback(async () => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Failed to retrieve auth token on client:', error);
      return null;
    }
  }, [getToken]);

  return memoizedGetToken;
}

/**
 * Client-side hook for getting the current user ID
 * @returns A stable function that returns the current user ID
 */
export function useAuthUserId() {
  const { user } = useUser();
  
  const getUserId = useCallback(() => {
    if (!user) return null;
    return user.id;
  }, [user]);
  
  return getUserId;
}
