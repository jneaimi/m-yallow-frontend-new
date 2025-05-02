'use client';

import { createClientApiClient } from '@/lib/api-client';
import { useAuthToken } from '@/lib/auth/client';
import { useCallback } from 'react';

/**
 * Hook that provides a stable function to get an API client for client components
 */
export function useApiClient() {
  const getToken = useAuthToken(); // This now returns a stable function reference

  // Wrap the async function in useCallback to stabilize its reference
  const getApiClient = useCallback(async () => {
    const token = await getToken();
    return createClientApiClient(token || undefined);
  }, [getToken]); // Dependency: the stable getToken function

  return getApiClient;
}
