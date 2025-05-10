'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { parseApiError } from '@/lib/api/error-utils';
import { toast } from "sonner";

export function useAddReview() {
  const queryClient = useQueryClient();
  const reviewClient = useReviewClient();
  
  return useMutation({
    mutationFn: async ({
      providerId,
      rating,
      comment
    }: {
      providerId: number;
      rating: number;
      comment: string;
    }) => {
      // Debug what's being sent to the API
      console.log('Adding review with:', { providerId, rating, comment });
      
      // Pass the data correctly to the API client
      return reviewClient.addReview(providerId, { rating, comment });
    },
    onSuccess: (newReview) => {
      // Invalidate provider reviews query
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProvider(newReview.providerId),
      });
      
      // Invalidate user reviews query
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byUser('me'),
      });
      
      toast.success('Your review has been submitted for approval');
    },
    onError: (error: unknown) => {
      console.error('Failed to add review:', error);
      
      // Use the centralized error parsing utility
      toast.error(parseApiError(error));
    },
  });
}
