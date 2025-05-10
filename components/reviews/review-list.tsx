'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { ReviewCard } from './review-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useProviderReviews, useUserReviews } from '@/hooks/reviews';

interface ReviewListProps {
  providerId: number;
  userReviews?: boolean;
}

export function ReviewList({ providerId, userReviews = false }: ReviewListProps) {
  console.log('ReviewList rendered with props:', { providerId, userReviews });
  
  // Use the appropriate query hook based on whether we're showing user reviews or provider reviews
  const providerReviewsQuery = useProviderReviews(providerId, {
    enabled: !userReviews, // Only fetch provider reviews when not showing user reviews
  });
  
  const userReviewsQuery = useUserReviews(providerId, {
    enabled: userReviews, // Only fetch user reviews when showing user reviews
  });
  
  // Determine which query to use
  const { data: reviews, isLoading, error } = userReviews 
    ? userReviewsQuery 
    : providerReviewsQuery;
  
  const { user } = useUser();
  const userId = user?.id;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading reviews. Please try again later.</p>
        <pre className="mt-2 text-xs text-muted-foreground">
          {(error as Error).message}
        </pre>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {userReviews
            ? "You haven't submitted any reviews yet."
            : "No reviews available for this provider yet."}
        </p>
        {userReviews && (
          <Button asChild>
            <a href="/search">Browse Providers to Review</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          providerId={review.providerId}
          isOwner={userId === review.userId}
        />
      ))}
    </div>
  );
}
