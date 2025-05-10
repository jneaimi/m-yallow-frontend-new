'use client';

import { useApiClient } from '@/lib/api-client/client';
import { useCallback, useMemo } from 'react'; // Import hooks

export const REVIEW_API = {
  LIST_BY_PROVIDER: (providerId: number) => `/providers/${providerId}/reviews`,
  LIST_USER_REVIEWS: '/users/me/reviews',
  ADD: (providerId: number) => `/providers/${providerId}/reviews`,
  UPDATE: (reviewId: number) => `/reviews/${reviewId}`,
  DELETE: (reviewId: number) => `/reviews/${reviewId}`,
};

export interface Review {
  id: number;
  providerId: number;
  userId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

/**
 * Client-side hook providing stable review operation methods
 */
export function useReviewClient() {
  const getApiClient = useApiClient(); // Stable function

  const getProviderReviews = useCallback(async (providerId: number): Promise<Review[]> => {
    const apiClient = await getApiClient();
    
    // Define the raw API response types with snake_case
    interface ApiReview {
      id: number;
      provider_id: number;
      user_id: string;
      rating: number;
      comment: string;
      status: 'pending' | 'approved' | 'rejected';
      created_at: string;
      updated_at: string;
    }
    
    type ApiResponse = { reviews: ApiReview[], total: number };
    
    const response = await apiClient.get<ApiResponse>(REVIEW_API.LIST_BY_PROVIDER(providerId));
    
    // Transform the snake_case properties to camelCase
    const transformedReviews = (response.data?.reviews || []).map(review => ({
      id: review.id,
      providerId: review.provider_id,
      userId: review.user_id,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      createdAt: review.created_at,
      updatedAt: review.updated_at
    }));
    
    console.log('API Reviews (raw):', response.data?.reviews);
    console.log('Transformed Reviews:', transformedReviews);
    
    return transformedReviews;
  }, [getApiClient]);

  const getUserReviews = useCallback(async (): Promise<Review[]> => {
    console.log('getUserReviews called');
    const apiClient = await getApiClient();
    
    // Define the raw API response types with snake_case
    interface ApiReview {
      id: number;
      provider_id: number;
      user_id: string;
      rating: number;
      comment: string;
      status: 'pending' | 'approved' | 'rejected';
      created_at: string;
      updated_at: string;
    }
    
    try {
      console.log('Fetching from endpoint:', REVIEW_API.LIST_USER_REVIEWS);
      const response = await apiClient.get<{ reviews: ApiReview[], total: number }>(REVIEW_API.LIST_USER_REVIEWS);
      console.log('User reviews API response:', response.data);
      
      // Transform the snake_case properties to camelCase
      const transformedReviews = (response.data?.reviews || []).map(review => ({
        id: review.id,
        providerId: review.provider_id,
        userId: review.user_id,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: review.created_at,
        updatedAt: review.updated_at
      }));
      
      console.log('Transformed user reviews:', transformedReviews);
      return transformedReviews;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
  }, [getApiClient]);

  const addReview = useCallback(async (
    providerId: number,
    data: { rating: number; comment: string }
  ): Promise<Review> => {
    const apiClient = await getApiClient();
    
    // Define the raw API response type with snake_case
    interface ApiReview {
      id: number;
      provider_id: number;
      user_id: string;
      rating: number;
      comment: string;
      status: 'pending' | 'approved' | 'rejected';
      created_at: string;
      updated_at: string;
    }
    
    // Debug the data being sent to the API
    console.log('API client sending to server:', { 
      url: REVIEW_API.ADD(providerId), 
      providerId, 
      data 
    });
    
    // Do some validation before sending to the API
    if (!data.comment || data.comment.trim().length < 10) {
      throw new Error(`Invalid comment: "${data.comment}". Comment must be at least 10 characters long.`);
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error(`Invalid rating: ${data.rating}. Rating must be between 1 and 5.`);
    }
    
    // Try to format the data the way the server might expect it
    // Let's try a really simple object with just the core fields
    const formattedData = {
      rating: data.rating,
      comment: data.comment
    };
    
    try {
      // First try with the simplified data
      console.log('Attempting with formatted data:', formattedData);
      let response;
      
      try {
        response = await apiClient.post<ApiReview>(REVIEW_API.ADD(providerId), formattedData);
      } catch (initialError) {
        // If that fails, try with just the original data as a fallback
        console.log('First attempt failed, trying with original data:', data);
        response = await apiClient.post<ApiReview>(REVIEW_API.ADD(providerId), data);
      }
      
      console.log('Successful review submission, response:', response.data);
      const apiReview = response.data;
    
      // Transform to camelCase
      const transformedReview: Review = {
        id: apiReview.id,
        providerId: apiReview.provider_id,
        userId: apiReview.user_id,
        rating: apiReview.rating,
        comment: apiReview.comment,
        status: apiReview.status,
        createdAt: apiReview.created_at,
        updatedAt: apiReview.updated_at
      };
      
      return transformedReview;
    } catch (error: any) {
      // Detailed error logging
      console.error('Error in addReview API call:', error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Server response data:', error.response.data);
        console.error('Server response status:', error.response.status);
        console.error('Server response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  }, [getApiClient]);

  const updateReview = useCallback(async (
    reviewId: number,
    data: { rating: number; comment: string }
  ): Promise<Review> => {
    const apiClient = await getApiClient();
    
    // Define the raw API response type with snake_case
    interface ApiReview {
      id: number;
      provider_id: number;
      user_id: string;
      rating: number;
      comment: string;
      status: 'pending' | 'approved' | 'rejected';
      created_at: string;
      updated_at: string;
    }
    
    const response = await apiClient.put<ApiReview>(REVIEW_API.UPDATE(reviewId), data);
    const apiReview = response.data;
    
    // Transform to camelCase
    const transformedReview: Review = {
      id: apiReview.id,
      providerId: apiReview.provider_id,
      userId: apiReview.user_id,
      rating: apiReview.rating,
      comment: apiReview.comment,
      status: apiReview.status,
      createdAt: apiReview.created_at,
      updatedAt: apiReview.updated_at
    };
    
    return transformedReview;
  }, [getApiClient]);

  const deleteReview = useCallback(async (reviewId: number): Promise<void> => {
    const apiClient = await getApiClient();
    await apiClient.delete(REVIEW_API.DELETE(reviewId));
  }, [getApiClient]);

  // Memoize the returned object to ensure its reference is stable
  const client = useMemo(() => ({
    getProviderReviews,
    getUserReviews,
    addReview,
    updateReview,
    deleteReview,
  }), [getProviderReviews, getUserReviews, addReview, updateReview, deleteReview]);

  return client;
}
