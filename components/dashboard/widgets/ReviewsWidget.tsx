'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

// This would be replaced with a proper hook to get review data
function useReviewsData() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  
  React.useEffect(() => {
    // Simulate loading reviews data
    const timer = setTimeout(() => {
      setReviews([
        {
          id: '1',
          providerName: 'Blue Sky Therapy',
          providerImage: '/providers/provider1.jpg',
          rating: 5,
          comment: 'Excellent service! The therapist was professional and really helped with my back pain.',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          replies: 1,
        },
        {
          id: '2',
          providerName: 'Mindful Counseling',
          providerImage: '/providers/provider2.jpg',
          rating: 4,
          comment: 'Very helpful session. Looking forward to continuing therapy.',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          replies: 0,
        },
      ]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return { reviews, isLoading };
}

export function ReviewsWidget() {
  const { reviews, isLoading } = useReviewsData();
  
  // Generate stars for ratings
  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating 
            ? 'text-amber-500 fill-amber-500' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-full max-w-[180px]" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5" />
          My Reviews
        </CardTitle>
        <CardDescription>
          {reviews.length > 0
            ? `You've written ${reviews.length} reviews`
            : "You haven't written any reviews yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.providerImage || ''} alt={review.providerName} />
                      <AvatarFallback>
                        {review.providerName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">{review.providerName}</h4>
                      <div className="flex items-center mt-0.5">
                        {renderRatingStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(review.date, { addSuffix: true })}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {review.comment}
                </p>
                
                {review.replies > 0 && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <MessageCircle className="h-3 w-3" />
                    <span>{review.replies} {review.replies === 1 ? 'reply' : 'replies'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Share your experiences by reviewing providers you've used
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/search">
                Find Providers to Review
              </a>
            </Button>
          </div>
        )}
      </CardContent>
      {reviews.length > 0 && (
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <a href="/dashboard/reviews">
              View all my reviews
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
