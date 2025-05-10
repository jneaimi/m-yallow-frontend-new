'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { searchProviders, SearchParams, SearchResponse } from '@/lib/api/providers/search';

/**
 * Custom hook for searching providers using TanStack Query
 * 
 * @param options - Search parameters
 * @returns Query result with providers matching the search criteria
 */
export function useSearchProviders({
  query = "",
  categoryId,
  limit = 20
}: SearchParams = {}) {
  return useQuery<SearchResponse>({
    queryKey: queryKeys.provider.search({ query, categoryId, limit }),
    queryFn: () => searchProviders({ query, categoryId, limit }),
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    retry: 1, // Only retry once to avoid excessive API calls
  });
}
