'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { useAuth } from '@clerk/nextjs';
import { Review } from '@/lib/api/reviews';

export function useUserReviews(
  filteredProviderId?: number,
  options?: Partial<UseQueryOptions<Review[]>>
) {
  const reviewClient = useReviewClient();
  const { isSignedIn } = useAuth();
  
  const result = useQuery<Review[]>({
    queryKey: queryKeys.reviews.byUser('me'),
    queryFn: () => reviewClient.getUserReviews(),
    enabled: !!isSignedIn && (options?.enabled !== false),
    ...options,
  });
  
  // Filter reviews by providerId if requested
  const filteredReviews = filteredProviderId && result.data 
    ? result.data.filter(review => review.providerId === filteredProviderId)
    : result.data;
  
  return {
    ...result,
    data: filteredReviews,
  };
}
