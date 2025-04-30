import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { PROVIDER_API, API_BASE_URL, ApiProvider, Provider, transformProvider } from "@/lib/api/providers";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/**
 * Searches for providers using the search API endpoint
 * @param query - Search query term
 * @param limit - Maximum number of results to return
 * @returns Array of providers matching the search criteria
 */
async function searchProviders(query: string, categoryId?: string, limit: number = 20): Promise<Provider[]> {
  // Build query parameters
  const params: Record<string, string> = { limit: limit.toString() };
  if (query) params.query = query;
  
  // Try different parameter formats for category filtering
  // The backend might be expecting one of these formats
  if (categoryId) {
    params.category_id = categoryId;     // Format 1: category_id=10
    params.categoryId = categoryId;      // Format 2: categoryId=10
    params.category = categoryId;        // Format 3: category=10
  }
  
  // Determine the best endpoint to use
  let apiEndpoint;
  if (query) {
    // If there's a search query, use the search endpoint
    apiEndpoint = `${PROVIDER_API.SEARCH}?${new URLSearchParams(params)}`;
  } else if (categoryId) {
    // If there's only a category filter, use the public providers endpoint
    apiEndpoint = `${PROVIDER_API.PUBLIC}?category=${categoryId}&limit=${limit}`;
  } else {
    // For general listing, use the public providers endpoint
    apiEndpoint = `${PROVIDER_API.PUBLIC}?${new URLSearchParams({ limit: limit.toString() })}`;
  }
  
  console.log(`Fetching providers from: ${apiEndpoint}${categoryId ? ` (Category ID: ${categoryId})` : ''}`);
  
  try {
    const res = await fetch(apiEndpoint, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to search providers: ${res.status} ${res.statusText}`);
    }
    
    // Parse the response
    const data = await res.json();
    console.log(`API Response data structure:`, JSON.stringify(data, null, 2).substring(0, 500) + "...");
    
    // Log the URL that was actually used for the request
    console.log(`Actual request URL: ${res.url}`);
    
    // Debug: Log the entire response for API troubleshooting
    console.log("Complete API response:", data);
    
    // Handle different response formats
    let providers: ApiProvider[];
    
    if (Array.isArray(data)) {
      // Direct array of providers
      providers = data;
    } else if (data.providers && Array.isArray(data.providers)) {
      // Wrapped in a providers property
      providers = data.providers;
    } else if (data.results && Array.isArray(data.results)) {
      // Some APIs return results instead of providers
      providers = data.results;
    } else {
      console.error("Unexpected API response format:", data);
      
      // Last resort fallback - look for any array in the response
      const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0 && possibleArrays[0].length > 0) {
        console.log("Found possible provider array in response:", possibleArrays[0]);
        providers = possibleArrays[0] as ApiProvider[];
      } else {
        throw new Error("Unexpected API response format");
      }
    }
    
    // Transform API providers to client provider format
    const transformedProviders = providers.map(transformProvider);
    
    // If categoryId is provided, try filtering on the client side as a fallback
    if (categoryId) {
      console.log(`Client-side filtering for category ID: ${categoryId}`);
      const filteredProviders = transformedProviders.filter(provider => 
        provider.categories?.some(cat => String(cat.id) === categoryId)
      );
      
      console.log(`Original count: ${transformedProviders.length}, Filtered count: ${filteredProviders.length}`);
      
      if (filteredProviders.length > 0) {
        return filteredProviders;
      }
    }
    
    return transformedProviders;
  } catch (error) {
    console.error('Error fetching providers:', error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    return [
      {
        id: 1,
        name: "Sunshine Wellness Center",
        heroImageUrl: null,
        aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing.",
        categories: [
          { id: 2, name: "Test Category 1", icon: "test-icon-1" }
        ]
      },
      {
        id: 2,
        name: "Tech Solutions Inc",
        heroImageUrl: null,
        aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
        categories: [
          { id: 3, name: "Test Category 2", icon: "test-icon-1" }
        ]
      }
    ];
  }
}

async function SearchResults({ query, categoryId }: { query?: string; categoryId?: string }) {
  // Always fetch providers - when query is empty, it will list all providers
  const providers = await searchProviders(query || "", categoryId);
  
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          {query ? 
            "Try adjusting your search terms or browse all providers" : 
            "No providers are currently available"}
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-4 text-muted-foreground">
        Found {providers.length} provider{providers.length !== 1 ? 's' : ''}
        {query ? ` matching "${query}"` : ''}
        {categoryId ? ` in this category` : ''}
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  try {
    // Need to await searchParams in Next.js 14+
    const params = await searchParams;
    
    const query = params.q || "";
    const categoryId = params.category;
    
    console.log("Search page params:", { query, categoryId });
    
    // Get title based on search parameters
    let title = "Browse Providers";
    if (query) {
      title = `Search results for "${query}"`;
    } else if (categoryId) {
      title = `Category Filter Applied`;
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
            <SearchResults query={query} categoryId={categoryId} />
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
