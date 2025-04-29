import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { PROVIDER_API, ApiProvider, Provider, transformProvider } from "@/lib/api/providers";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/**
 * Searches for providers using the search API endpoint
 * @param query - Search query term
 * @param limit - Maximum number of results to return
 * @returns Array of providers matching the search criteria
 */
async function searchProviders(query: string, limit: number = 20): Promise<Provider[]> {
  // If no query is provided, list all providers instead, but still apply the limit
  const apiEndpoint = query 
    ? `${PROVIDER_API.SEARCH}?${new URLSearchParams({ query, limit: limit.toString() })}`
    : `${PROVIDER_API.LIST}?${new URLSearchParams({ limit: limit.toString() })}`;
  
  console.log(`Fetching providers from: ${apiEndpoint}`);
  
  try {
    const res = await fetch(apiEndpoint, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to search providers: ${res.status} ${res.statusText}`);
    }
    
    // Parse the response
    const data = await res.json();
    console.log(`API Response data structure:`, JSON.stringify(data, null, 2).substring(0, 500) + "...");
    
    // Handle different response formats
    let providers: ApiProvider[];
    
    if (Array.isArray(data)) {
      // Direct array of providers
      providers = data;
    } else if (data.providers && Array.isArray(data.providers)) {
      // Wrapped in a providers property
      providers = data.providers;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected API response format");
    }
    
    // Transform API providers to client provider format
    return providers.map(transformProvider);
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

async function SearchResults({ query }: { query?: string }) {
  // Always fetch providers - when query is empty, it will list all providers
  const providers = await searchProviders(query || "");
  
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
    
    const title = query 
      ? `Search results for "${query}"`
      : "Browse Providers";
    
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
            <SearchResults query={query} />
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
