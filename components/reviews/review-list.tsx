'use client';

import React from 'react';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Review } from '@/lib/api/reviews';
import { useReviews } from '@/hooks/use-reviews';
import { ReviewCard } from './review-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ReviewListProps {
  providerId: number;
  userReviews?: boolean;
}

export function ReviewList({ providerId, userReviews = false }: ReviewListProps) {
  console.log('ReviewList rendered with props:', { providerId, userReviews });
  
  // When showing user reviews, we always want to fetch from the user reviews endpoint
  const { reviews: allUserReviews, isLoading, error, fetchReviews } = useReviews({ 
    providerId: userReviews ? undefined : providerId,
    fetchUserReviews: userReviews
  });
  
  // Filter reviews by providerId if we're showing user reviews but want to filter for a specific provider
  const reviews = React.useMemo(() => {
    if (userReviews && providerId > 0 && Array.isArray(allUserReviews)) {
      console.log(`Filtering user reviews for provider ${providerId}`);
      return allUserReviews.filter(review => review.providerId === providerId);
    }
    return allUserReviews;
  }, [allUserReviews, userReviews, providerId]);
  
  console.log('ReviewList - useReviews hook result:', { 
    totalReviews: allUserReviews?.length || 0,
    filteredReviews: reviews?.length || 0,
    isLoading, 
    hasError: !!error 
  });
  
  const { user } = useUser();
  const userId = user?.id;
  
  console.log('Current user ID:', userId);

  const handleUpdated = () => {
    fetchReviews();
  };

  const handleDeleted = () => {
    fetchReviews();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          {userReviews
            ? "You haven't submitted any reviews yet."
            : "No reviews available for this provider yet."}
        </p>
        {userReviews && (
          <Button asChild>
            <a href="/providers">Browse Providers to Review</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.isArray(reviews) ? reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          providerId={review.providerId}
          isOwner={userId === review.userId}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )) : null} {/* Handle case where reviews might not be an array, though useReviews should ensure it is */}
    </div>
  );
}
