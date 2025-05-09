import { SearchBar } from "@/components/providers/search-bar";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { CategoryProviders } from "@/components/providers/category-providers";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import { PROVIDER_API, transformProvider } from "@/lib/api/providers";
import { Category, categoriesQueryFn } from "@/lib/api/categories";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetches providers by category ID for server-side prefetching
 */
async function fetchProvidersByCategory(categoryId: string) {
  console.log(`[Server] Fetching providers for category ID: ${categoryId}`);
  
  const endpoint = `${PROVIDER_API.PUBLIC}?category=${encodeURIComponent(categoryId)}`;
  
  try {
    // Use the isServer check for applying Next.js specific options
    const isServer = typeof window === 'undefined';
    const res = await fetch(
      endpoint,
      isServer ? ({ next: { revalidate: 60 } } as RequestInit & { next: { revalidate: number } }) : undefined
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch providers: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!data.providers) {
      throw new Error('Unexpected API response format: "providers" field is missing');
    }
    
    if (!Array.isArray(data.providers)) {
      throw new Error('Unexpected API response format: "providers" is not an array');
    }
    
    return data.providers.map(transformProvider);
  } catch (error) {
    console.error(`[Server] Error fetching providers:`, error);
    throw error; // Re-throw for proper error handling
  }
}

/**
 * Get category name by ID
 */
async function getCategoryName(categoryId: string, categories: Category[] = []): Promise<string> {
  if (!Array.isArray(categories)) {
    return `Category ${categoryId}`;
  }
  
  const category = categories.find(cat => String(cat.id) === categoryId);
  return category ? category.name : `Category ${categoryId}`;
}

/**
 * Main category page component with TanStack Query integration
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  // Ensure params is fully resolved before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const categoryId = resolvedParams.id;
  const queryClient = getQueryClient();
  
  // Prefetch both queries in parallel
  await Promise.all([
    // Prefetch providers by category
    queryClient.prefetchQuery({
      queryKey: queryKeys.provider.byCategory(categoryId),
      queryFn: () => fetchProvidersByCategory(categoryId),
    }),
    
    // Prefetch categories for the category name
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.public(),
      queryFn: categoriesQueryFn,
    })
  ]);
  
  // Get the categories data to determine the category name
  const categories = queryClient.getQueryData<Category[]>(queryKeys.categories.public()) ?? [];
  const categoryName = await getCategoryName(categoryId, categories);
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{categoryName} Providers</h1>
            <a 
              href="/" 
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Browse All Categories
            </a>
          </div>
          <SearchBar initialValue="" />
        </div>
        
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoryProviders categoryId={categoryId} />
        </HydrationBoundary>
      </ResponsiveContainer>
    </div>
  );
}
