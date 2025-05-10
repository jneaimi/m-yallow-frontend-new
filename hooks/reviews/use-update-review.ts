'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { toast } from "sonner";

export function useUpdateReview() {
  const queryClient = useQueryClient();
  const reviewClient = useReviewClient();
  
  return useMutation({
    mutationFn: async ({
      reviewId,
      data
    }: {
      reviewId: number;
      data: { rating: number; comment: string };
    }) => {
      return reviewClient.updateReview(reviewId, data);
    },
    onSuccess: (updatedReview) => {
      // Invalidate provider reviews query
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProvider(updatedReview.providerId),
      });
      
      // Invalidate user reviews query
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byUser('me'),
      });
      
      toast.success('Your review has been updated and submitted for approval');
    },
    onError: (error) => {
      console.error('Failed to update review:', error);
      toast.error('Failed to update review. Please try again.');
    },
  });
}
