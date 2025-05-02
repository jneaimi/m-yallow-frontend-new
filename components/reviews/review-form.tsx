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
import { toast } from "sonner";
import { Star, StarIcon } from 'lucide-react';
import { useReviews } from '@/hooks/use-reviews';
import { Review } from '@/lib/api/reviews';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: 'Review must be at least 10 characters',
  }).max(1000, {
    message: 'Review must not exceed 1000 characters',
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
  const [isEditing, setIsEditing] = useState(!!initialData?.id);
  const { addReview, updateReview } = useReviews({ providerId });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      let review;

      if (isEditing && initialData?.id) {
        review = await updateReview(initialData.id, {
          rating: data.rating,
          comment: data.comment,
        });
        toast.success('Your review has been updated and submitted for approval.');
      } else {
        review = await addReview({
          rating: data.rating,
          comment: data.comment,
        });
        toast.success('Your review has been submitted for approval.');
      }

      if (review && onSuccess) {
        onSuccess(review);
      }

      if (!isEditing) {
        form.reset({ rating: 0, comment: '' });
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit your review. Please try again.');
    }
  };

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
                  placeholder="Share your experience with this provider..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></span>
          )}
          {isEditing ? 'Update Review' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
}
