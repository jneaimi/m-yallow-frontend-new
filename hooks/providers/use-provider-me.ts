'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';
import { ApiProvider } from '@/lib/api/providers';

/**
 * Hook to fetch the current provider's profile data
 * @returns Query result containing provider data, loading state, and errors
 */
export function useProviderMe() {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  return useQuery<ApiProvider | null>({
    queryKey: queryKeys.provider.me(),
    queryFn: async () => {
      if (!isSignedIn) return null;
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get('/providers/me');
        return response.data;
      } catch (err: unknown) {
        // 404 means the user is not a provider yet, which is not an error
        if (err && typeof err === 'object' && 'response' in err && 
            err.response && typeof err.response === 'object' && 
            'status' in err.response && err.response.status === 404) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!isSignedIn,
  });
}
