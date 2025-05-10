import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { PROVIDER_API, ApiProvider, transformProvider } from '@/lib/api/providers';

// Create separate function for reuse in both client and server contexts
export async function fetchProvider(id: string | number) {
  try {
    const url = PROVIDER_API.DETAIL(id);
    console.log(`Fetching provider from: ${url}`);
    
    // Check if code is running on the server
    const isServer = typeof window === 'undefined';
    
    // Apply Next.js cache options only on the server
    const res = await fetch(
      url,
      isServer ? 
        { next: { revalidate: 60 } } : 
        undefined
    );
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch provider: ${res.status} ${res.statusText}`);
    }
    
    const provider = await res.json() as ApiProvider;
    console.log(`Provider data received:`, JSON.stringify(provider, null, 2));
    
    // Transform API provider to client provider format
    return transformProvider(provider);
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error instanceof Error ? error.message : String(error));
    throw error; // Re-throw so TanStack Query can handle it
  }
}

/**
 * Hook to fetch provider details
 * @param id Provider ID
 * @returns Query result with provider data
 */
export function useProvider(id: string | number) {
  return useQuery({
    queryKey: queryKeys.provider.detail(typeof id === 'string' ? parseInt(id) : id),
    queryFn: () => fetchProvider(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute to match current revalidation time
  });
}
