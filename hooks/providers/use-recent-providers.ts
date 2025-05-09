'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { PROVIDER_API, Provider, RecentProvider, transformRecentProvider } from '@/lib/api/providers';

/**
 * Fetches recent providers from the API
 * @param limit Number of recent providers to fetch
 * @returns The recent providers
 */
async function fetchRecentProviders(limit: number = 6): Promise<Provider[]> {
  const res = await fetch(`${PROVIDER_API.RECENT}?limit=${limit}`, { 
    next: { revalidate: 60 }  // Revalidate every 60 seconds
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch recent providers');
  }
  
  // Parse the response
  const providers = await res.json() as RecentProvider[];
  
  // Transform providers for client components
  return providers.map(transformRecentProvider);
}

/**
 * Custom hook for fetching recent providers using TanStack Query
 * @param limit Number of recent providers to fetch
 * @returns Query result containing recent providers data, loading state, and error state
 */
export function useRecentProviders(limit: number = 6) {
  return useQuery({
    queryKey: queryKeys.provider.list({ type: 'recent', limit }),
    queryFn: () => fetchRecentProviders(limit),
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
}
