import { createServerApiClient } from '@/lib/api-client/server';
import 'server-only';

export const USER_PROFILE_API = {
  GET_PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
};

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
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
  const response = await apiClient.patch(USER_PROFILE_API.UPDATE_PROFILE, data);
  return response.data;
}
