'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { useAuth } from '@clerk/nextjs';

/**
 * Hook to check if the current user has already reviewed a specific provider
 */
export function useHasReview(providerId: number) {
  const { isSignedIn, userId } = useAuth();
  const reviewClient = useReviewClient();
  
  // Fetch all reviews by the user
  const { data: userReviews, isLoading, error } = useQuery({
    queryKey: queryKeys.reviews.byUser('me'),
    queryFn: () => reviewClient.getUserReviews(),
    enabled: !!isSignedIn && !!userId,
  });
  
  // Check if any of the reviews are for the specified provider
  const hasReviewedProvider = userReviews?.some(review => review.providerId === providerId) || false;
  
  return {
    hasReviewedProvider,
    isLoading,
    error
  };
}
