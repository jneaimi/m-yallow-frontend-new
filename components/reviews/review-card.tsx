'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/lib/api/reviews';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, StarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ReviewForm } from './review-form';
import { useReviews } from '@/hooks/use-reviews';

interface ReviewCardProps {
  review: Review;
  providerId: number;
  isOwner: boolean;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export function ReviewCard({
  review,
  providerId,
  isOwner,
  onUpdated,
  onDeleted,
}: ReviewCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteReview } = useReviews({ providerId });

  const handleDeleteReview = async () => {
    if (!review.id) return;
    
    const success = await deleteReview(review.id);
    if (success && onDeleted) {
      onDeleted();
    }
    setIsDeleteDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    if (onUpdated) {
      onUpdated();
    }
  };

  // Format the date with improved error handling
  let timeAgo = 'Recent'; // Friendlier default value
  
  // Debug logging to help trace date-related issues
  console.log('Review object:', {
    id: review.id,
    createdAt: review.createdAt,
    type: typeof review.createdAt,
    hasValue: Boolean(review.createdAt)
  });
  
  if (review.createdAt) {
    try {
      const reviewDate = new Date(review.createdAt);
      
      // Validate the parsed date
      if (!isNaN(reviewDate.getTime())) { 
        timeAgo = formatDistanceToNow(reviewDate, { addSuffix: true });
        console.log('Successfully formatted date:', timeAgo);
      } else {
        console.warn('Invalid date format received:', review.createdAt);
        console.warn('Parsed date is invalid:', reviewDate);
      }
    } catch (error) {
      console.error('Error parsing date string:', review.createdAt);
      console.error('Error details:', error);
    }
  } else {
    console.warn('Missing createdAt value for review:', review.id);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= review.rating ? (
                    <StarIcon className="w-4 h-4 fill-primary text-primary" />
                  ) : (
                    <Star className="w-4 h-4 text-muted-foreground" />
                  )}
                </span>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {timeAgo}
              </span>
            </div>
          </div>
          {review.status === 'pending' && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              Pending approval
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{review.comment}</p>
      </CardContent>
      {isOwner && (
        <CardFooter className="flex justify-end space-x-2 pt-0">
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Review</DialogTitle>
                <DialogDescription>
                  Update your review for this provider. Your updated review will need to be approved before it's visible to others.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ReviewForm
                  providerId={providerId}
                  initialData={{
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                  }}
                  onSuccess={handleEditSuccess}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Review</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your review? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteReview}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
}
