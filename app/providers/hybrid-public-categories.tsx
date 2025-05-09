"use client";

import { useCategories } from '@/hooks/categories/use-categories';
import { HybridCategoriesTanstack } from '@/components/providers/hybrid-categories-tanstack';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Client component that fetches and displays public categories
 * using TanStack Query and the hybrid approach (carousel + modal)
 * Both carousel and modal now use TanStack Query for data fetching
 */
export function HybridPublicCategories() {
  const { data: categories, isLoading, error } = useCategories();
  
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !categories) {
    console.error("Error loading categories:", error);
    return (
      <div className="text-center py-8 text-muted-foreground">
        Unable to load categories. Please try again later.
      </div>
    );
  }
  
  // Using the TanStack Query integrated component
  return <HybridCategoriesTanstack categories={categories} />;
}
