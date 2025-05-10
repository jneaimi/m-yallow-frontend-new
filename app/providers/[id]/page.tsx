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
  // Await params to access properties safely
  const id = (await params).id;
  const providerId = Number(id);
  
  // Early return for invalid IDs
  if (Number.isNaN(providerId)) {
    return {
      title: 'Invalid Provider ID',
      description: 'The provider ID provided is not valid'
    };
  }
  
  try {
    // Fetch the provider data directly for metadata generation
    const provider = await fetchProvider(providerId);
    
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
  // Await params to access properties safely
  const id = (await params).id;
  const queryClient = getQueryClient();
  const providerId = Number(id);

  // Fast-fail on bad ids (e.g. "abc")
  if (Number.isNaN(providerId)) {
    notFound();
  }
  
  try {
    // Prefetch the provider data on the server
    await queryClient.prefetchQuery({
      queryKey: queryKeys.provider.detail(providerId),
      queryFn: () => fetchProvider(providerId),
    });
    
    // Check if the provider exists to handle notFound()
    const provider = queryClient.getQueryData(queryKeys.provider.detail(providerId));
    
    if (!provider) {
      notFound();
    }
    
    // Render the client component with the hydrated query client
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProviderDetailClient providerId={id} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Error fetching provider:', error);
    throw error; // Let Next.js handle the error
  }
}
