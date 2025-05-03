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
      // Step 1: Get the upload URL
      const { uploadUrl, publicUrl } = await this.getHeroImageUploadUrl(providerId);
      
      // Step 2: Upload the file directly to storage
      await this.uploadFileToUrl(uploadUrl, file);
      
      // Step 3: Confirm the upload with the backend
      const confirmation = await this.confirmHeroImageUpload(providerId, publicUrl);
      
      return confirmation.heroImageUrl || publicUrl;
    }
  };
}