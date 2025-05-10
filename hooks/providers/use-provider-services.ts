'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

/**
 * Hook to fetch services offered by the current provider
 * @returns Query result containing provider services, loading state, and errors
 */
export function useProviderServices() {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  return useQuery<Service[]>({
    queryKey: queryKeys.provider.services(),
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get('/providers/me/services');
        return response.data.services;
      } catch (err) {
        // If the API doesn't support services yet, return an empty array
        console.warn('Error fetching provider services, returning empty array:', err);
        return [];
      }
    },
    enabled: !!isSignedIn,
  });
}
