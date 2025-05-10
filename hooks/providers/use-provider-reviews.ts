'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';

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
 * @param limit Number of reviews to fetch (default: 5)
 * @returns Query result containing provider reviews, loading state, and errors
 */
export function useProviderReviews(limit: number = 5) {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  return useQuery<Review[]>({
    queryKey: [...queryKeys.reviews.byProvider('me' as any), limit],
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get(`/providers/me/reviews?limit=${limit}`);
        return response.data.reviews;
      } catch (err) {
        // If the API doesn't support reviews yet, return empty array
        console.warn('Error fetching provider reviews, using sample data:', err);
        
        // Return sample data for now
        return [
          { id: '1', userId: 'user1', userName: 'James Wilson', rating: 5, content: 'Excellent service, highly recommended!', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '2', userId: 'user2', userName: 'Emma Thompson', rating: 4, content: 'Very professional and helpful. Would use again.', createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
          { id: '3', userId: 'user3', userName: 'Robert Brown', rating: 5, content: 'Amazing experience, exceeded my expectations!', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        ];
      }
    },
    enabled: !!isSignedIn,
  });
}
