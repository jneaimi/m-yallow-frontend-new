'use client';

import { useApiClient } from '@/lib/api-client/client';
import axios, { AxiosError } from 'axios';

export const USER_PROFILE_API = {
  GET_PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
};

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
  displayName?: string;
  preferences?: {
    notifications?: {
      email?: boolean;
      app?: boolean;
    };
    privacy?: {
      showReviews?: boolean;
    };
  };
}

/**
 * Helper function to handle profile-related API errors
 * @param error The error from the API call
 * @param operation The operation being performed (for logging)
 * @param data Optional data that was being sent (for debugging in dev)
 */
function handleProfileError(error: unknown, operation: string, data?: Partial<UserProfile> | Record<string, unknown>): never {
  // Safe logging based on environment
  if (process.env.NODE_ENV === 'development') {
    console.error(`[debug] Error ${operation}:`, {
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      statusText: axios.isAxiosError(error) ? error.response?.statusText : undefined,
      // Include data only in development to prevent PII leakage
      data: axios.isAxiosError(error) ? error.response?.data : undefined,
      message: error instanceof Error ? error.message : String(error),
      ...(data && { requestData: data })
    });
  } else {
    // Safe logging for production - no PII
    console.error(`Error ${operation}:`, {
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      statusText: axios.isAxiosError(error) ? error.response?.statusText : undefined,
      message: error instanceof Error ? error.message : String(error),
      ...(data && { requestDataFields: Object.keys(data) })
    });
  }

  // Handle specific error types
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw new Error('Authentication error. Please sign in again.');
    } else if (error.response?.status === 404) {
      throw new Error('Your profile could not be found. Please try signing out and back in.');
    } else if (error.response?.status === 422) {
      throw new Error('Invalid data provided. Please check your input.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error while working with your profile. Please try again later.');
    } else if (!error.response && error.message?.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
  }
  
  // Re-throw with generic message for unhandled errors
  throw new Error(`An unexpected error occurred while ${operation}. Please try again.`);
}

/**
 * Client-side hook for user profile operations
 */
export function useUserProfileClient() {
  const getApiClient = useApiClient();

  return {
    getUserProfile: async (): Promise<UserProfile> => {
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get(USER_PROFILE_API.GET_PROFILE);
        return response.data;
      } catch (err: unknown) {
        return handleProfileError(err, 'fetching user profile');
      }
    },
    
    updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.patch(USER_PROFILE_API.UPDATE_PROFILE, data);
        return response.data;
      } catch (err: unknown) {
        return handleProfileError(err, 'updating user profile', data);
      }
    }
  };
}
