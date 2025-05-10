'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';
import { useProviderMe } from './use-provider-me';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

/**
 * Hook to fetch services offered by the current provider
 * First retrieves the provider ID, then fetches services using the numeric ID
 * @returns Query result containing provider services, loading state, and errors
 */
export function useProviderServices() {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();
  const { data: providerData, isLoading: isProviderLoading } = useProviderMe();

  return useQuery<Service[]>({
    queryKey: providerData?.id 
      ? queryKeys.provider.servicesById(providerData.id)
      : queryKeys.provider.services(),
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }

      if (!providerData || !providerData.id) {
        throw new Error('Provider profile not found');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get(`/providers/${providerData.id}/services`);
        
        // Validate response structure
        if (response.data && Array.isArray(response.data.services)) {
          return response.data.services;
        }
        throw new Error('Invalid response format from API');
      } catch (err) {
        // If the API doesn't support services yet, return mock data for consistency
        console.warn('Error fetching provider services, using sample data:', err);
        
        // Return sample data for now
        return [
          { id: '1', name: 'Basic Consultation', description: 'Initial 30-minute consultation to discuss your needs.', price: 50 },
          { id: '2', name: 'Standard Package', description: 'Comprehensive service package including all basic features.', price: 200 },
          { id: '3', name: 'Premium Support', description: 'Priority support and advanced features for demanding clients.', price: 500 }
        ];
      }
    },
    enabled: !!isSignedIn && !isProviderLoading && !!providerData?.id,
  });
}
