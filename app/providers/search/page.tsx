import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { SearchResults } from "@/components/providers/search-results";
import { getQueryClient } from "@/lib/query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { searchProviders } from "@/lib/api/providers/search";
import { queryKeys } from "@/lib/query/keys";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  try {
    // Parse parameters
    const params = await searchParams;
    
    const query = params.q || "";
    const categoryId = params.category;
    
    // Get title based on search parameters
    let title = "Browse Providers";
    if (query) {
      title = `Search results for "${query}"`;
    } else if (categoryId) {
      title = `Category Filter Applied`;
    }
    
    // Initialize QueryClient and prefetch data
    const queryClient = getQueryClient();
    
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.provider.search({ 
          query, 
          categoryId, 
          limit: 20
        }),
        queryFn: () => searchProviders({
          query,
          categoryId,
          limit: 20
        }),
      });
    } catch (error) {
      // Log error but let client component handle display
      console.error("Error prefetching search data:", error);
    }
    
    return (
      <div className="py-8 md:py-12">
        <ResponsiveContainer maxWidth="xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">{title}</h1>
            <SearchBar initialValue={query} />
          </div>
          
          <Suspense fallback={
            <div className="py-12">
              <div className="animate-pulse space-y-6">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <SearchResults 
                initialQuery={query} 
                initialCategoryId={categoryId} 
                limit={20}
              />
            </HydrationBoundary>
          </Suspense>
        </ResponsiveContainer>
      </div>
    );
  } catch (error) {
    console.error("Error rendering search page:", error);
    
    // Simplified error state
    return (
      <div className="py-8 md:py-12">
        <ResponsiveContainer maxWidth="xl">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Browse Providers</h1>
            <p className="text-muted-foreground">
              An error occurred while loading providers. Please try again.
            </p>
          </div>
        </ResponsiveContainer>
      </div>
    );
  }
}
