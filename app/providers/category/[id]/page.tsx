import { Suspense } from "react";
import { ProviderCard } from "@/components/providers/provider-card";
import { SearchBar } from "@/components/providers/search-bar";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { 
  PROVIDER_API, 
  API_BASE_URL, 
  ApiProvider, 
  Provider, 
  transformProvider 
} from "@/lib/api/providers";
import { fetchPublicCategories } from "@/lib/api/categories";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

/**
 * Fetches providers by category ID using the public/providers endpoint
 */
async function fetchProvidersByCategory(categoryId: string): Promise<Provider[]> {
  console.log(`Fetching providers for category ID: ${categoryId}`);
  
  // Use the public providers endpoint with category filter
  const endpoint = `${PROVIDER_API.PUBLIC}?category=${categoryId}`;
  
  try {
    console.log(`Using public providers endpoint: ${endpoint}`);
    const res = await fetch(endpoint, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch providers: ${res.status} ${res.statusText}`);
    }
    
    // Parse the response
    const data = await res.json();
    console.log(`Response from public providers:`, data);
    
    // Extract providers from the response
    if (!data.providers || !Array.isArray(data.providers)) {
      console.error("Unexpected API response format:", data);
      return [];
    }
    
    const providers = data.providers.map(transformProvider);
    console.log(`Successfully retrieved ${providers.length} providers from public API`);
    
    // Log categories for debugging
    providers.forEach(provider => {
      console.log(`Provider ${provider.name} has categories:`, 
        provider.categories?.map(c => `${c.id}:${c.name}`).join(', ') || 'none');
    });
    
    return providers;
  } catch (error) {
    console.error(`Error fetching from public providers endpoint:`, error);
    return [];
  }
}

/**
 * Get category name by ID
 */
async function getCategoryName(categoryId: string): Promise<string> {
  try {
    const { categories } = await fetchPublicCategories();
    const category = categories.find(cat => String(cat.id) === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  } catch (error) {
    console.error("Error fetching category name:", error);
    return `Category ${categoryId}`;
  }
}

/**
 * Category providers display component
 */
async function CategoryProviders({ categoryId }: { categoryId: string }) {
  const providers = await fetchProvidersByCategory(categoryId);
  const categoryName = await getCategoryName(categoryId);
  
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

/**
 * Main category page component
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  // In Next.js, we need to await params for dynamic routes
  const parameters = await Promise.resolve(params);
  const categoryId = parameters.id;
  const categoryName = await getCategoryName(categoryId);
  
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
          <CategoryProviders categoryId={categoryId} />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
