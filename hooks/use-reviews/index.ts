'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from "sonner";
import { useReviewClient, Review } from '@/lib/api/reviews/client';

interface UseReviewsOptions {
  providerId?: number;
  fetchUserReviews?: boolean;
}

export function useReviews({ providerId, fetchUserReviews = false }: UseReviewsOptions = {}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const reviewClient = useReviewClient();

  const fetchReviews = useCallback(async () => {
    console.log('useReviews.fetchReviews called with:', { providerId, fetchUserReviews, isSignedIn });
    setIsLoading(true);
    setError(null);
    
    try {
      let fetchedReviews: Review[] | undefined | null; // Allow for non-array results initially
      
      if (fetchUserReviews) {
        console.log('Fetching user reviews...');
        if (!isSignedIn) {
          console.log('User not signed in, returning empty array');
          setReviews([]);
          return;
        }
        fetchedReviews = await reviewClient.getUserReviews();
        console.log('User reviews fetched:', fetchedReviews);
      } else if (providerId) {
        console.log(`Fetching reviews for provider ${providerId}...`);
        fetchedReviews = await reviewClient.getProviderReviews(providerId);
        console.log('Provider reviews fetched:', fetchedReviews);
      } else {
        // If neither is specified, maybe default to empty or handle differently?
        // For now, setting to empty array to prevent errors later.
        console.warn('useReviews: Neither providerId nor fetchUserReviews specified');
        fetchedReviews = []; 
        // throw new Error('Either providerId or fetchUserReviews must be specified');
      }
      
      // Ensure fetchedReviews is always an array before setting state
      if (Array.isArray(fetchedReviews)) {
        setReviews(fetchedReviews);
      } else {
        console.warn('Fetched reviews was not an array:', fetchedReviews); // Log unexpected data
        setReviews([]); // Default to empty array if the fetched data isn't an array
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('Failed to load reviews');
      toast.error('Failed to load reviews. Please try again.');
      setReviews([]); // Also set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, providerId, fetchUserReviews, reviewClient]);

  const addReview = useCallback(async (data: { rating: number; comment: string }) => {
    if (!providerId) {
      throw new Error('Provider ID is required to add a review');
    }
    
    if (!isSignedIn) {
      toast.info('Please sign in to leave a review');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newReview = await reviewClient.addReview(providerId, data);
      
      // Only add to the list if we're viewing provider reviews (not on user reviews page)
      if (!fetchUserReviews) {
        setReviews(prev => {
          // --- Add detailed logging --- 
          console.log('Inside setReviews for addReview:');
          console.log('Type of prev:', typeof prev);
          console.log('Is prev an array?', Array.isArray(prev));
          console.log('Value of prev:', prev);
          console.log('Value of newReview:', newReview);
          // --- End detailed logging ---
          
          // Safeguard: Ensure prev is an array before updating
          if (Array.isArray(prev)) {
            // Use concat instead of spread operator as an alternative
            try {
              const result = prev.concat(newReview);
              console.log('Concat successful, returning:', result);
              return result;
            } catch (e) {
              console.error('Error during concat:', e);
              console.error('prev value during error:', prev);
              console.error('newReview value during error:', newReview);
              return [newReview]; // Fallback on concat error
            }
          } else {
            console.warn('useReviews addReview: prev state was not an array. Resetting state.', prev);
            return [newReview]; // Reset state to only the new review if prev was corrupted
          }
        });
      }
      
      toast.success('Your review has been submitted for approval');
      
      return newReview;
    } catch (err) {
      console.error('Failed to add review:', err);
      setError('Failed to submit review');
      toast.error('Failed to submit review. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [providerId, isSignedIn, fetchUserReviews, reviewClient]);

  const updateReview = useCallback(async (reviewId: number, data: { rating: number; comment: string }) => {
    if (!isSignedIn) {
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const updatedReview = await reviewClient.updateReview(reviewId, data);
      
      setReviews(prev => 
        prev.map(review => review.id === reviewId ? updatedReview : review)
      );
      
      toast.success('Your review has been updated and submitted for approval');
      
      return updatedReview;
    } catch (err) {
      console.error('Failed to update review:', err);
      setError('Failed to update review');
      toast.error('Failed to update review. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, reviewClient]);

  const deleteReview = useCallback(async (reviewId: number) => {
    if (!isSignedIn) {
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await reviewClient.deleteReview(reviewId);
      
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      toast.success('Your review has been deleted');
      
      return true;
    } catch (err) {
      console.error('Failed to delete review:', err);
      setError('Failed to delete review');
      toast.error('Failed to delete review. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, reviewClient]);

  // Load reviews on initial mount and when dependencies change
  useEffect(() => {
    console.log('useReviews useEffect triggered', { providerId, fetchUserReviews, isSignedIn });
    // Ensure we have valid conditions to fetch
    if (fetchUserReviews && isSignedIn) {
      console.log('Fetching user reviews from useEffect');
      fetchReviews();
    } else if (providerId && providerId > 0) {
      console.log(`Fetching provider ${providerId} reviews from useEffect`);
      fetchReviews();
    } else if (fetchUserReviews) {
      console.log('Not fetching user reviews because user is not signed in');
    } else if (!providerId) {
      console.log('Not fetching provider reviews because providerId is not set');
    } else {
      console.log('Not fetching reviews. Current state:', { providerId, fetchUserReviews, isSignedIn });
    }
  }, [providerId, fetchUserReviews, isSignedIn, fetchReviews]);

  return {
    reviews,
    isLoading,
    error,
    addReview,
    updateReview,
    deleteReview,
    fetchReviews,
  };
}
