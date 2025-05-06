'use client';

import { useApiClient } from '@/lib/api-client/client';
import { PROVIDER_API } from '../providers';

export interface CreateProviderData {
  name: string;
  contact: string;
  location: string;
  about: string;
  
  // Location specific fields
  latitude: number;
  longitude: number;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
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

export interface GetHeroImageUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

export interface ConfirmHeroImageResponse {
  success: boolean;
  heroImageUrl: string;
}

/**
 * Client-side hook for provider operations
 */
export function useProviderClient() {
  const getApiClient = useApiClient();

  return {
    /**
     * Get the current user's provider information
     * @returns The provider information for the current user, or null if not a provider
     */
    getMyProvider: async (): Promise<ApiProvider | null> => {
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get('/providers/me');
        return response.data;
      } catch (err: any) {
        // If status is 404, the user is not a provider yet
        if (err.response && err.response.status === 404) {
          return null;
        }
        // Re-throw other errors
        throw err;
      }
    },
    
    /**
     * Update categories for the current provider
     * @param categoryIds Array of category IDs to assign to the provider
     * @returns Success status
     */
    updateProviderCategories: async (categoryIds: number[]): Promise<{ success: boolean }> => {
      try {
        const apiClient = await getApiClient();
        // The API path should be as per documentation
        await apiClient.post('/api/providers/me/categories', categoryIds, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return { success: true };
      } catch (error) {
        console.error('Error updating provider categories:', error);
        throw error;
      }
    },
    /**
     * Create a new provider profile
     * @param data Provider profile data
     * @returns The created provider
     */
    createProvider: async (data: CreateProviderData): Promise<CreateProviderResponse> => {
      const apiClient = await getApiClient();
      const response = await apiClient.post(PROVIDER_API.LIST, data);
      return response.data;
    },
    
    /**
     * Get a presigned URL for uploading a hero image
     * @param providerId ID of the provider
     * @returns Object containing uploadUrl and publicUrl
     */
    getHeroImageUploadUrl: async (providerId: string | number): Promise<GetHeroImageUrlResponse> => {
      const response = await fetch(`/api/providers/${providerId}/hero-image/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }
      
      return response.json();
    },
    
    /**
     * Upload a file to a presigned URL
     * @param uploadUrl The presigned URL for uploading
     * @param file The file to upload
     * @param contentType The content type of the file
     */
    uploadFileToUrl: async (uploadUrl: string, file: File): Promise<void> => {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file to storage');
      }
    },
    
    /**
     * Confirm that a hero image has been uploaded
     * @param providerId ID of the provider
     * @param publicUrl The public URL of the uploaded image
     * @returns Confirmation response
     */
    confirmHeroImageUpload: async (providerId: string | number, publicUrl: string): Promise<ConfirmHeroImageResponse> => {
      const response = await fetch(`/api/providers/${providerId}/hero-image/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm upload');
      }
      
      return response.json();
    },
    
    /**
     * Complete hero image upload process in one function
     * @param providerId ID of the provider
     * @param file The image file to upload
     * @returns The public URL of the uploaded image
     */
    uploadHeroImage: async (providerId: string | number, file: File): Promise<string> => {
      const apiClient = await getApiClient();
      
      // Step 1: Get the upload URL
      const urlResponse = await fetch(`/api/providers/${providerId}/hero-image/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!urlResponse.ok) {
        const errorData = await urlResponse.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }
      
      const { uploadUrl, publicUrl } = await urlResponse.json();
      
      // Step 2: Upload the file directly to storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }
      
      // Step 3: Confirm the upload with the backend
      const confirmResponse = await fetch(`/api/providers/${providerId}/hero-image/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicUrl }),
      });
      
      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json();
        throw new Error(errorData.error || 'Failed to confirm upload');
      }
      
      const confirmation = await confirmResponse.json();
      return confirmation.heroImageUrl || publicUrl;
    }
  };
}