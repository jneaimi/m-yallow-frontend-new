'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { parseApiError } from '@/lib/api/error-utils';
import { toast } from "sonner";
import { Review } from '@/lib/api/reviews';

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const reviewClient = useReviewClient();
  
  return useMutation({
    mutationFn: async ({
      reviewId,
      providerId
    }: {
      reviewId: number;
      providerId: number;
    }) => {
      // The API client expects only the reviewId
      await reviewClient.deleteReview(reviewId);
      // Return both values for cache updates
      return { reviewId, providerId };
    },
    onSuccess: ({ reviewId, providerId }) => {
      // Update the provider reviews cache to remove the deleted review
      queryClient.setQueryData<Review[]>(
        queryKeys.reviews.byProvider(providerId),
        (old) => old?.filter(review => review.id !== reviewId) || []
      );
      
      // Update the user reviews cache to remove the deleted review
      queryClient.setQueryData<Review[]>(
        queryKeys.reviews.byUser('me'),
        (old) => old?.filter(review => review.id !== reviewId) || []
      );
      
      toast.success('Your review has been deleted');
    },
    onError: (error: unknown) => {
      console.error('Failed to delete review:', error);
      toast.error(parseApiError(error));
    },
  });
}
