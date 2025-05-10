'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { useAuth } from '@clerk/nextjs';

export function useUserReviews(filteredProviderId?: number) {
  const reviewClient = useReviewClient();
  const { isSignedIn } = useAuth();
  
  const result = useQuery({
    queryKey: queryKeys.reviews.byUser('me'),
    queryFn: () => reviewClient.getUserReviews(),
    enabled: !!isSignedIn,
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
