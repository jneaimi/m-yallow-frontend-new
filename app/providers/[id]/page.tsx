import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { fetchProvider } from '@/hooks/providers/use-provider';
import { ProviderDetailClient } from '@/components/providers/provider-detail-client';

interface ProviderPageProps {
  params: { id: string };
}

// Generate metadata for this page
export async function generateMetadata({ params }: ProviderPageProps) {
  try {
    // Fetch the provider data directly for metadata generation
    const provider = await fetchProvider(params.id);
    
    if (!provider) {
      return {
        title: 'Provider not found',
        description: 'The requested provider could not be found'
      };
    }

    return {
      title: `${provider.name} | Provider Profile`,
      description: provider.about ? 
        (provider.about.length > 160 ? `${provider.about.substring(0, 157)}...` : provider.about) 
        : `View details about ${provider.name}`,
      openGraph: {
        images: provider.heroImageUrl ? [provider.heroImageUrl] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Provider Details',
      description: 'View provider details'
    };
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const queryClient = getQueryClient();
  
  try {
    // Prefetch the provider data on the server
    await queryClient.prefetchQuery({
      queryKey: queryKeys.provider.detail(parseInt(params.id)),
      queryFn: () => fetchProvider(params.id),
    });
    
    // Check if the provider exists to handle notFound()
    const provider = queryClient.getQueryData(queryKeys.provider.detail(parseInt(params.id)));
    
    if (!provider) {
      notFound();
    }
    
    // Render the client component with the hydrated query client
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProviderDetailClient providerId={params.id} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw error; // Let Next.js handle the error
  }
}
