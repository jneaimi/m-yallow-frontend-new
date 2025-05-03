'use client';

import { useState, useEffect } from 'react';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';
import { ApiProvider } from '@/lib/api/providers';

export interface ProviderStatus {
  isProvider: boolean;
  isApproved: boolean;
  providerData: ApiProvider | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProviderStatus(): ProviderStatus {
  const [providerData, setProviderData] = useState<ApiProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  const fetchProviderStatus = async () => {
    if (!isSignedIn) {
      setIsLoading(false);
      setProviderData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiClient = await getApiClient();
      const response = await apiClient.get('/providers/me');
      setProviderData(response.data);
    } catch (err: any) {
      // 404 means the user is not a provider yet, which is not an error
      if (err.response && err.response.status === 404) {
        setProviderData(null);
      } else {
        console.error('Error fetching provider status:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch provider status'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, [isSignedIn]);

  return {
    isProvider: !!providerData,
    isApproved: providerData?.approved || false,
    providerData,
    isLoading,
    error,
    refetch: fetchProviderStatus
  };
}
