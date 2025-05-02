import { createServerApiClient } from '@/lib/api-client/server';
import 'server-only';

export const USER_PROFILE_API = {
  GET_PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
};

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  preferences?: {
    notifications: {
      email: boolean;
      app: boolean;
    };
    privacy: {
      showReviews: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Get the current authenticated user's profile
 * @returns User profile data
 */
export async function getUserProfile(): Promise<UserProfile> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.get(USER_PROFILE_API.GET_PROFILE);
  return response.data;
}

/**
 * Update the current authenticated user's profile
 * @param data Updated profile data
 * @returns Updated user profile
 */
export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.put(USER_PROFILE_API.UPDATE_PROFILE, data);
  return response.data;
}
