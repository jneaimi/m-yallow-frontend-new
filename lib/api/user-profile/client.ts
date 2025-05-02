'use client';

import { useApiClient } from '@/lib/api-client/client';

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
 * Client-side hook for user profile operations
 */
export function useUserProfileClient() {
  const getApiClient = useApiClient();

  return {
    getUserProfile: async (): Promise<UserProfile> => {
      const apiClient = await getApiClient();
      const response = await apiClient.get(USER_PROFILE_API.GET_PROFILE);
      return response.data;
    },
    
    updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
      const apiClient = await getApiClient();
      const response = await apiClient.put(USER_PROFILE_API.UPDATE_PROFILE, data);
      return response.data;
    }
  };
}
