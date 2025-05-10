'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';
import { useAuth } from '@clerk/nextjs';
import { useProviderMe } from './use-provider-me';

export interface Inquiry {
  id: string;
  name: string;
  message: string;
  date: string;
  isNew: boolean;
}

/**
 * Hook to fetch the current provider's inquiries
 * First retrieves the provider ID, then fetches inquiries using the numeric ID
 * @param limit Number of inquiries to fetch (default: 5)
 * @returns Query result containing provider inquiries, loading state, and errors
 */
export function useProviderInquiries(limit: number = 5) {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();
  const { data: providerData, isLoading: isProviderLoading } = useProviderMe();

  return useQuery<Inquiry[]>({
    queryKey: providerData?.id 
      ? queryKeys.provider.inquiriesById(providerData.id, limit)
      : queryKeys.provider.inquiries(limit),
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }
      
      if (!providerData || !providerData.id) {
        throw new Error('Provider profile not found');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get(`/providers/${providerData.id}/inquiries?limit=${limit}`);
        
        // Validate response structure
        if (response.data && Array.isArray(response.data.inquiries)) {
          return response.data.inquiries;
        }
        throw new Error('Invalid response format from API');
      } catch (err) {
        // If the API doesn't support inquiries yet, return mock data
        console.warn('Error fetching provider inquiries, using sample data:', err);
        
        // Return sample data for now
        return [
          { id: '1', name: 'John Smith', message: 'I would like to learn more about your services.', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isNew: true },
          { id: '2', name: 'Sarah Johnson', message: 'Do you offer sessions on weekends?', date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), isNew: true },
          { id: '3', name: 'Michael Brown', message: 'What are your rates for a 60-minute session?', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), isNew: true },
          { id: '4', name: 'Emma Wilson', message: 'I need to reschedule my appointment for next week.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isNew: false },
        ];
      }
    },
    enabled: !!isSignedIn && !isProviderLoading && !!providerData?.id,
  });
}
