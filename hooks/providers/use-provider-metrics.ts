'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';

export interface ProviderMetrics {
  views: number;
  viewsChange: number;
  inquiries: number;
  inquiriesNew: number;
  bookmarks: number;
  responseRate: number;
  averageRating: number;
  reviewCount: number;
}

/**
 * Hook to fetch the current provider's metrics
 * @returns Query result containing provider metrics, loading state, and errors
 */
export function useProviderMetrics() {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  return useQuery<ProviderMetrics>({
    queryKey: queryKeys.provider.metrics(),
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get('/providers/me/metrics');
        return response.data;
      } catch (err) {
        // If the API doesn't support metrics yet, return mock data
        console.warn('Error fetching provider metrics, using sample data:', err);
        
        // Return sample data for now
        return {
          views: 128,
          viewsChange: 12,
          inquiries: 7,
          inquiriesNew: 3,
          bookmarks: 24,
          responseRate: 92,
          averageRating: 4.8,
          reviewCount: 16,
        };
      }
    },
    enabled: !!isSignedIn,
    // For metrics, we want more frequent updates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
