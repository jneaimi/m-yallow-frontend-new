import { createServerApiClient } from '@/lib/api-client/server';
import 'server-only';

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

// Type definitions for API responses
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

type ProviderReviewsResponse = {
  reviews: ApiReview[];
  total: number;
};

type UserReviewsResponse = {
  reviews: ApiReview[];
  total: number;
};

/**
 * Transform API reviews from snake_case to camelCase
 */
function transformApiReviews(apiReviews: ApiReview[]): Review[] {
  return apiReviews.map(review => ({
    id: review.id,
    providerId: review.provider_id,
    userId: review.user_id,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.created_at,
    updatedAt: review.updated_at
  }));
}

/**
 * Get all approved reviews for a specific provider
 * @param providerId The ID of the provider
 * @returns Array of reviews for the provider
 */
export async function getProviderReviews(providerId: number): Promise<Review[]> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.get<ProviderReviewsResponse>(REVIEW_API.LIST_BY_PROVIDER(providerId));
  
  // Transform the response to match client expectations
  return transformApiReviews(response.data.reviews || []);
}

/**
 * Get all reviews submitted by the current authenticated user
 * @returns Array of reviews submitted by the current user
 */
export async function getUserReviews(): Promise<Review[]> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.get<UserReviewsResponse>(REVIEW_API.LIST_USER_REVIEWS);
  
  // Transform the response to match client expectations
  return transformApiReviews(response.data.reviews || []);
}

/**
 * Add a review for a provider
 * @param providerId The ID of the provider to review
 * @param data Review data (rating and comment)
 * @returns The created review
 */
export async function addReview(
  providerId: number, 
  data: { rating: number; comment: string }
): Promise<Review> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.post<ApiReview>(REVIEW_API.ADD(providerId), data);
  
  // Transform the response to match client expectations
  return {
    id: response.data.id,
    providerId: response.data.provider_id,
    userId: response.data.user_id,
    rating: response.data.rating,
    comment: response.data.comment,
    status: response.data.status,
    createdAt: response.data.created_at,
    updatedAt: response.data.updated_at
  };
}

/**
 * Update an existing review
 * @param reviewId The ID of the review to update
 * @param data Updated review data
 * @returns The updated review
 */
export async function updateReview(
  reviewId: number, 
  data: { rating: number; comment: string }
): Promise<Review> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.put<ApiReview>(REVIEW_API.UPDATE(reviewId), data);
  
  // Transform the response to match client expectations
  return {
    id: response.data.id,
    providerId: response.data.provider_id,
    userId: response.data.user_id,
    rating: response.data.rating,
    comment: response.data.comment,
    status: response.data.status,
    createdAt: response.data.created_at,
    updatedAt: response.data.updated_at
  };
}

/**
 * Delete a review
 * @param reviewId The ID of the review to delete
 */
export async function deleteReview(reviewId: number): Promise<void> {
  const apiClient = await createServerApiClient();
  await apiClient.delete(REVIEW_API.DELETE(reviewId));
}
