'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProvidersList, ProviderListParams } from '@/lib/api/providers/list';
import { ProvidersListResponse } from '@/lib/api/providers';

/**
 * Custom hook for fetching providers list with pagination and filtering
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Query result containing providers list data, loading state, and error state
 */
export function useProvidersList({
  page = 1,
  pageSize = 12,
  name = '',
  location = '',
  category = '',
}: ProviderListParams = {}) {
  return useQuery<ProvidersListResponse>({
    queryKey: queryKeys.provider.list({ page, pageSize, name, location, category }),
    queryFn: () => fetchProvidersList({ page, pageSize, name, location, category }),
    keepPreviousData: true, // Keep previous page data while loading next page
    staleTime: 60 * 1000, // Consider data stale after 1 minute
    retry: 1, // Only retry once to avoid excessive failed requests
    // On error, fall back to mock data 
    onError: (error) => {
      console.error('Error in useProvidersList:', error);
    }
  });
}
