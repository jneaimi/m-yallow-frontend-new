'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
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
    onError: (error: any) => {
      console.error('Failed to add review:', error);
      
      // Try to extract more detailed error information
      let errorMessage = 'Failed to submit review. Please try again.';
      
      if (error.message && error.message.includes('Invalid comment')) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes('Invalid rating')) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        console.error('Server error response:', error.response.data);
        
        // Check for the duplicate review error
        if (error.response.data.detail === "You have already submitted a review for this provider") {
          errorMessage = "You have already submitted a review for this provider.";
        } else if (error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        } else if (error.response.data.error) {
          errorMessage = `Error: ${error.response.data.error}`;
        } else if (error.response.data.detail) {
          errorMessage = `Error: ${error.response.data.detail}`;
        }
      }
      
      toast.error(errorMessage);
    },
  });
}
