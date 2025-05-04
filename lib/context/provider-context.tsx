'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';
import { ApiProvider } from '@/lib/api/providers';

// Types
type ProviderContextType = {
  isProvider: boolean;
  isApproved: boolean;
  providerData: ApiProvider | null;
  isLoading: boolean;
  error: Error | null;
  refreshProviderStatus: () => Promise<void>;
};

// Create context
const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

// Provider component
export function ProviderProvider({ children }: { children: ReactNode }) {
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

  const value = {
    isProvider: !!providerData,
    isApproved: providerData?.approved || false,
    providerData,
    isLoading,
    error,
    refreshProviderStatus: fetchProviderStatus,
  };

  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

// Hook to use the provider context
export function useProvider() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProvider must be used within a ProviderProvider');
  }
  return context;
}
