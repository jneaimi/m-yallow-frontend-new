import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchPublicCategories } from '@/lib/api/categories';
import { featuredCategories } from '@/components/providers/category-icons';

/**
 * Layout component that prefetches categories data
 * This improves performance by having the data ready
 * when the client components mount
 */
export default async function ProvidersLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const queryClient = getQueryClient();
  
  // Prefetch categories data on the server
  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.categories.public(),
      queryFn: async () => {
        try {
          const { categories } = await fetchPublicCategories();
          
          // Note: We only prefetch the basic data here
          // The actual icon React nodes will be created client-side
          return categories.map(category => ({
            id: String(category.id),
            name: category.name,
            icon: category.icon, // Just the icon name, not the React component
            description: `Find ${category.name} providers and services`
          }));
        } catch (error) {
          console.error("Error prefetching categories:", error);
          // Map featuredCategories to ensure consistent data shape with successful fetch path
          return featuredCategories.map(category => ({
            id: String(category.id),
            name: category.name,
            // If the static fallback has a React element, mark it for client-side processing
            icon: typeof category.icon === 'string' ? category.icon : '__REACT_ELEMENT__',
            description: `Find ${category.name} providers and services`
          }));
        }
      },
    });
  } catch (error) {
    // Log error but don't let it crash the page
    console.error("Failed to prefetch categories data:", error);
  }
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
