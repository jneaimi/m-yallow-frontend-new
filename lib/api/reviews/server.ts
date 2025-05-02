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

/**
 * Get all approved reviews for a specific provider
 * @param providerId The ID of the provider
 * @returns Array of reviews for the provider
 */
export async function getProviderReviews(providerId: number): Promise<Review[]> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.get(REVIEW_API.LIST_BY_PROVIDER(providerId));
  return response.data;
}

/**
 * Get all reviews submitted by the current authenticated user
 * @returns Array of reviews submitted by the current user
 */
export async function getUserReviews(): Promise<Review[]> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.get(REVIEW_API.LIST_USER_REVIEWS);
  return response.data;
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
  const response = await apiClient.post(REVIEW_API.ADD(providerId), data);
  return response.data;
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
  const response = await apiClient.put(REVIEW_API.UPDATE(reviewId), data);
  return response.data;
}

/**
 * Delete a review
 * @param reviewId The ID of the review to delete
 */
export async function deleteReview(reviewId: number): Promise<void> {
  const apiClient = await createServerApiClient();
  await apiClient.delete(REVIEW_API.DELETE(reviewId));
}
