'use client';

import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveGrid } from "@/components/ui/responsive";
import { useProvidersByCategory } from "@/hooks/providers/use-providers-by-category";
import { useCategoryName } from "@/hooks/categories/use-category-name";

interface CategoryProvidersProps {
  categoryId: string;
}

export function CategoryProviders({ categoryId }: CategoryProvidersProps) {
  const { 
    data: providers = [], 
    isLoading: isLoadingProviders,
    error,
    isError
  } = useProvidersByCategory(categoryId);
  
  const { 
    categoryName,
    isLoading: isLoadingCategory
  } = useCategoryName(categoryId);
  
  const isLoading = isLoadingProviders || isLoadingCategory;
  
  if (isLoading) {
    return (
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
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Error loading providers</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "There was a problem loading providers. Please try again later."}
        </p>
      </div>
    );
  }
  
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          No providers are currently available in this category
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-4 text-muted-foreground">
        Found {providers.length} provider{providers.length !== 1 ? 's' : ''} in {categoryName}
      </div>
      
      <ResponsiveGrid
        cols={1}
        smCols={2}
        lgCols={3}
        gap="6"
      >
        {providers.map((provider) => (
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
