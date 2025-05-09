import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { 
  PROVIDER_API,
  Provider, 
  transformProvider 
} from '@/lib/api/providers';

/**
 * Fetches providers by category ID using the public/providers endpoint
 */
async function fetchProvidersByCategory(categoryId: string): Promise<Provider[]> {
  console.log(`Fetching providers for category ID: ${categoryId}`);
  
  // Use the public providers endpoint with category filter
  const endpoint = `${PROVIDER_API.PUBLIC}?category=${categoryId}`;
  
  try {
    console.log(`Using public providers endpoint: ${endpoint}`);
    const isServer = typeof window === 'undefined';
    const res = await fetch(
      endpoint,
      isServer ? ({ next: { revalidate: 60 } } as RequestInit & { next: { revalidate: number } }) : undefined,
    );
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch providers: ${res.status} ${res.statusText}`);
    }
    
    // Parse the response
    const data = await res.json();
    console.log(`Response from public providers:`, data);
    
    // Extract providers from the response
    if (!data.providers) {
      throw new Error('Unexpected API response format: "providers" field is missing');
    }
    
    if (!Array.isArray(data.providers)) {
      throw new Error('Unexpected API response format: "providers" is not an array');
    }
    
    const providers = data.providers.map(transformProvider);
    console.log(`Successfully retrieved ${providers.length} providers from public API`);
    
    return providers;
  } catch (error) {
    console.error(`Error fetching from public providers endpoint:`, error);
    throw error; // Re-throw for TanStack Query to handle
  }
}

/**
 * Custom hook to fetch providers by category ID
 */
export function useProvidersByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.provider.byCategory(categoryId),
    queryFn: () => fetchProvidersByCategory(categoryId),
    staleTime: 60 * 1000, // Match the current revalidation time of 60 seconds
    enabled: Boolean(categoryId), // only run when we have a valid id
  });
}
