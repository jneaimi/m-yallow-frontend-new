'use client';

import { useApiClient } from '@/lib/api-client/client';
import { PROVIDER_API } from '../providers';

export interface CreateProviderData {
  name: string;
  contact: string;
  location: string;
  about: string;
}

export interface CreateProviderResponse {
  id: number;
  name: string;
  contact: string;
  location: string;
  about: string;
  created_at: string;
  updated_at: string;
}

/**
 * Client-side hook for provider operations
 */
export function useProviderClient() {
  const getApiClient = useApiClient();

  return {
    /**
     * Create a new provider profile
     * @param data Provider profile data
     * @returns The created provider
     */
    createProvider: async (data: CreateProviderData): Promise<CreateProviderResponse> => {
      const apiClient = await getApiClient();
      const response = await apiClient.post(PROVIDER_API.LIST, data);
      return response.data;
    }
  };
}