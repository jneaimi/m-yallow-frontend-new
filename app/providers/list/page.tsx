import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchProvidersList } from '@/lib/api/providers/list';
import { ProvidersListClient } from '@/components/providers/providers-list-client';

/**
 * Props for the List page component
 * @property searchParams - In Next.js 14/15, searchParams is a Promise that must be awaited
 */
interface ListPageProps {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string;
    name?: string;
    location?: string;
    category?: string;
  }>;
}

export default async function ListPage({ searchParams }: ListPageProps) {
  // Need to await searchParams in Next.js 14+
  const params = await searchParams;
  
  // Ensure page and pageSize are valid positive integers
  const parsedPage = parseInt(params.page || "1");
  const parsedPageSize = parseInt(params.pageSize || "12");
  
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const pageSize = isNaN(parsedPageSize) || parsedPageSize < 1 ? 12 : 
                   parsedPageSize > 100 ? 100 : parsedPageSize;
  
  // Get filter parameters
  const name = params.name || '';
  const location = params.location || '';
  const category = params.category || '';
  
  // Initialize QueryClient on the server
  const queryClient = getQueryClient();
  
  try {
    // Prefetch the initial data on the server
    await queryClient.prefetchQuery({
      queryKey: queryKeys.provider.list({ page, pageSize, name, location, category }),
      queryFn: () => fetchProvidersList({ page, pageSize, name, location, category }),
      retry: 1, // Only retry once to avoid excessive failed requests
    });
  } catch (error) {
    console.error('Failed to prefetch providers data:', error);
    // We'll let the client component handle displaying the error
  }
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">All Providers</h1>
          <SearchBar />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Loading providers...</div>}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProvidersListClient 
              initialPage={page} 
              initialPageSize={pageSize} 
              initialName={name}
              initialLocation={location}
              initialCategory={category}
            />
          </HydrationBoundary>
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}