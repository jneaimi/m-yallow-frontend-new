'use client';

import { useApiClient } from '@/lib/api-client/client';

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
      } catch (error: any) {
        // Enhanced error logging
        console.error('Error fetching user profile:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        // Specific handling for different error cases
        if (error.response?.status === 401) {
          throw new Error('Authentication error. Please sign in again.');
        } else if (error.response?.status === 404) {
          throw new Error('Your profile could not be found. Please try signing out and back in.');
        } else if (error.response?.status === 500) {
          throw new Error('Server error while loading your profile. Please try again later.');
        } else if (!error.response && error.message?.includes('network')) {
          throw new Error('Network error. Please check your connection.');
        }
        
        throw error; // Re-throw if no specific handling
      }
    },
    
    updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.patch(USER_PROFILE_API.UPDATE_PROFILE, data);
        return response.data;
      } catch (error: any) {
        // Enhanced error logging
        console.error('Error updating user profile:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          requestData: data
        });
        
        // Specific handling for different error cases
        if (error.response?.status === 401) {
          throw new Error('Authentication error. Please sign in again.');
        } else if (error.response?.status === 404) {
          throw new Error('Your profile could not be found for updating.');
        } else if (error.response?.status === 422) {
          throw new Error('Invalid data provided. Please check your input.');
        } else if (error.response?.status === 500) {
          throw new Error('Server error while updating your profile. Please try again later.');
        } else if (!error.response && error.message?.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        throw error; // Re-throw if no specific handling
      }
    }
  };
}
