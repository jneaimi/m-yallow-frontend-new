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
    
    const response = await apiClient.post<ApiReview>(REVIEW_API.ADD(providerId), data);
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
