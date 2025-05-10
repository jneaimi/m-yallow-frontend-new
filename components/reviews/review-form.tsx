'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Star, StarIcon } from 'lucide-react';
import { Review } from '@/lib/api/reviews';
import { useAddReview, useUpdateReview } from '@/hooks/reviews';

const reviewSchema = z.object({
  rating: z.number().min(1, {
    message: 'Please select a rating between 1 and 5 stars'
  }).max(5, {
    message: 'Please select a rating between 1 and 5 stars'
  }).refine((val) => val > 0, {
    message: 'Please select a rating'
  }),
  comment: z.string()
    .min(10, {
      message: 'Review must be at least 10 characters long'
    })
    .max(1000, {
      message: 'Review must not exceed 1000 characters'
    })
    .refine((val) => val.trim().length >= 10, {
      message: 'Review must contain at least 10 non-whitespace characters'
    }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  providerId: number;
  onSuccess?: (review: Review) => void;
  initialData?: {
    id?: number;
    rating?: number;
    comment?: string;
  };
}

export function ReviewForm({
  providerId,
  onSuccess,
  initialData,
}: ReviewFormProps) {
  const [isEditing] = useState(!!initialData?.id);
  
  const addReviewMutation = useAddReview();
  const updateReviewMutation = useUpdateReview();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || '',
    },
    mode: 'onChange', // Validate on field change for better UX
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      // Debug form data before submission
      console.log('Form data being submitted:', { providerId, data, isEditing });
      
      // Verify that form is actually valid
      const isValid = await form.trigger();
      console.log('Form validation result:', { 
        isValid, 
        errors: form.formState.errors,
        values: form.getValues()
      });
      
      if (!isValid) {
        console.error('Form validation failed:', form.formState.errors);
        return; // Don't proceed if validation fails
      }
      
      // Double-check comment length (including after trimming)
      const trimmedComment = data.comment.trim();
      if (trimmedComment.length < 10) {
        form.setError('comment', { 
          type: 'manual', 
          message: 'Review must contain at least 10 non-whitespace characters'
        });
        return;
      }
      
      if (isEditing && initialData?.id) {
        updateReviewMutation.mutate(
          {
            reviewId: initialData.id,
            data: {
              rating: data.rating,
              comment: data.comment,
            },
          },
          {
            onSuccess: (review) => {
              if (onSuccess) {
                onSuccess(review);
              }
            },
            onError: (error) => {
              console.error('Error updating review:', error);
            }
          }
        );
      } else {
        // Validate again here for extra safety
        if (!data.rating || data.rating < 1 || data.rating > 5) {
          console.error('Invalid rating:', data.rating);
          return;
        }
        
        if (!data.comment || data.comment.trim().length < 10) {
          console.error('Invalid comment:', data.comment);
          return;
        }
        
        // Add review - mutate with the providerId and review data
        addReviewMutation.mutate(
          {
            providerId,
            rating: data.rating,
            comment: data.comment
          },
          {
            onSuccess: (review) => {
              console.log('Review added successfully:', review);
              if (onSuccess) {
                onSuccess(review);
              }
              
              if (!isEditing) {
                form.reset({ rating: 0, comment: '' });
              }
            },
            onError: (error) => {
              console.error('Error adding review:', error);
            }
          }
        );
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const isPending = addReviewMutation.isPending || addReviewMutation.isLoading || updateReviewMutation.isPending || updateReviewMutation.isLoading;
  const error = addReviewMutation.error ?? updateReviewMutation.error;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => field.onChange(rating)}
                      className="focus:outline-none"
                    >
                      {rating <= field.value ? (
                        <StarIcon className="w-6 h-6 fill-primary text-primary" />
                      ) : (
                        <Star className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this provider... (minimum 10 characters)"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between">
                <FormMessage />
                <div className={`text-xs ${field.value?.length < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {field.value?.length || 0}/10 min
                </div>
              </div>
            </FormItem>
          )}
        />

        {error && (
          <div className="text-destructive text-sm">
            {error instanceof Error ? error.message : 'An error occurred. Please try again.'}
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending && (
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></span>
          )}
          {isEditing ? 'Update Review' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
}
