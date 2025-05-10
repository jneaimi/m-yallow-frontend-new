'use client';

import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveGrid } from "@/components/ui/responsive";
import { useSearchProviders } from "@/hooks/providers/use-search-providers";

interface SearchResultsProps {
  initialQuery?: string;
  initialCategoryId?: string;
  limit?: number;
}

export function SearchResults({ 
  initialQuery = "", 
  initialCategoryId,
  limit = 20
}: SearchResultsProps) {
  const { 
    data, 
    isLoading,
    isError,
    error 
  } = useSearchProviders({
    query: initialQuery,
    categoryId: initialCategoryId,
    limit
  });
  
  // Loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Error loading search results</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </div>
    );
  }
  
  // Empty results state
  if (!data || data.providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          {initialQuery ? 
            "Try adjusting your search terms or browse all providers" : 
            "No providers are currently available"}
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-4 text-muted-foreground">
        Found {data.total} provider{data.total !== 1 ? 's' : ''}
        {initialQuery ? ` matching "${initialQuery}"` : ''}
        {initialCategoryId ? ` in this category` : ''}
      </div>
      
      <ResponsiveGrid
        cols={1}
        smCols={2}
        lgCols={3}
        gap="6"
      >
        {data.providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name}
            heroImageUrl={provider.heroImageUrl}
            aboutSnippet={provider.aboutSnippet}
            categories={provider.categories}
          />
        ))}
      </ResponsiveGrid>
    </>
  );
}
