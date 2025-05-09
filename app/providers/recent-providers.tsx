import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { RecentProvidersClient } from '@/components/providers/recent-providers-client';
import { PROVIDER_API, RecentProvider, transformRecentProvider } from '@/lib/api/providers';

/**
 * Fetch recent providers data server-side
 * @param limit Number of recent providers to fetch
 * @returns Transformed providers data
 */
async function fetchRecentProviders(limit: number = 6) {
  try {
    const res = await fetch(`${PROVIDER_API.RECENT}?limit=${limit}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error('Failed to fetch recent providers');
    }
    
    // Use the updated API response format
    const providers = await res.json() as RecentProvider[];
    
    // Transform providers for client components
    return providers.map(transformRecentProvider);
  } catch (error) {
    console.error('Error fetching recent providers:', error);
    
    // Return mock data as fallback (optional, can be removed in production)
    return [
      {
        id: 1,
        name: "Sunshine Wellness Center",
        heroImageUrl: null,
        aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing."
      },
      {
        id: 2,
        name: "Tech Solutions Inc",
        heroImageUrl: null,
        aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity."
      },
      {
        id: 3,
        name: "Green Earth Landscaping",
        heroImageUrl: null,
        aboutSnippet: "Sustainable landscaping and garden design with eco-friendly practices and native plant expertise."
      }
    ].map(transformRecentProvider);
  }
}

interface RecentProvidersProps {
  limit?: number;
}

/**
 * Server component that prefetches recent providers data and hydrates the client component
 */
export async function RecentProviders({ limit = 6 }: RecentProvidersProps) {
  const queryClient = getQueryClient();
  
  // Prefetch the recent providers data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.provider.list({ type: 'recent', limit }),
    queryFn: () => fetchRecentProviders(limit),
  });
  
  // Hydrate the client with the prefetched data
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecentProvidersClient limit={limit} />
    </HydrationBoundary>
  );
}
