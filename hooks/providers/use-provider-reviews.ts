'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';
import { useProviderMe } from './use-provider-me';

export interface Review {
  id: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
  userName?: string;
}

/**
 * Hook to fetch reviews for the current provider
 * First retrieves the provider ID, then fetches reviews using the numeric ID
 * @param limit Number of reviews to fetch (default: 5)
 * @returns Query result containing provider reviews, loading state, and errors
 */
export function useProviderReviews(limit: number = 5) {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();
  const { data: providerData, isLoading: isProviderLoading } = useProviderMe();

  return useQuery<Review[]>({
    queryKey: providerData?.id 
      ? queryKeys.reviews.byProvider(providerData.id, limit)
      : queryKeys.reviews.byCurrentProvider(limit),
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }

      if (!providerData || !providerData.id) {
        throw new Error('Provider profile not found');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get(`/providers/${providerData.id}/reviews?limit=${limit}`);
        
        // Validate response structure
        if (response.data && Array.isArray(response.data.reviews)) {
          return response.data.reviews;
        }
        throw new Error('Invalid response format from API');
      } catch (err) {
        console.error('Error fetching provider reviews:', err);
        
        // Only return sample data in development mode
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using sample review data for development');
          return [
            { id: '1', userId: 'user1', userName: 'James Wilson', rating: 5, content: 'Excellent service, highly recommended!', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '2', userId: 'user2', userName: 'Emma Thompson', rating: 4, content: 'Very professional and helpful. Would use again.', createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '3', userId: 'user3', userName: 'Robert Brown', rating: 5, content: 'Amazing experience, exceeded my expectations!', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
          ];
        }
        
        // For production, propagate the error to be handled by React Query's error state
        throw err;
      }
    },
    enabled: !!isSignedIn && !isProviderLoading && !!providerData?.id,
  });
}
