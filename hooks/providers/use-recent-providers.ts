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
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 }  // Revalidate every 60 seconds
  });
  
  if (!res.ok) {
    throw new Error(
      `Failed to fetch recent providers: ${res.status} ${res.statusText}`
    );
  }
  
  // Parse the response
  let providers: RecentProvider[] = [];
  try {
    providers = await res.json() as RecentProvider[];
  } catch (error) {
    console.warn('Failed to parse providers response:', error);
    // Return empty array for empty or invalid JSON responses
    return [];
  }
  
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
    queryKey: ['providers', 'recent', limit],
    queryFn: () => fetchRecentProviders(limit),
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
}
