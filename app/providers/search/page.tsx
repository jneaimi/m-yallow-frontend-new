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
  if (!query) return [];
  
  try {
    const params = new URLSearchParams({
      query: query,
      limit: limit.toString()
    });
    
    // Use the new search endpoint
    const res = await fetch(`${PROVIDER_API.SEARCH}?${params}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error(`Failed to search providers: ${res.status} ${res.statusText}`);
    }
    
    // The new search endpoint returns an array directly
    const providers = await res.json() as ApiProvider[];
    
    // Transform API providers to client provider format
    return providers.map(transformProvider);
  } catch (error) {
    console.error('Error searching providers:', error instanceof Error ? error.message : String(error));
    
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
  const providers = await searchProviders(query || "");
  
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or browse all providers
        </p>
      </div>
    );
  }
  
  return (
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
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Need to await searchParams in Next.js 14+
  const params = await searchParams;
  
  const query = params.q || "";
  
  const title = query 
    ? `Search results for "${query}"`
    : "Provider Search";
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">{title}</h1>
          <SearchBar initialValue={query} />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Searching providers...</div>}>
          <SearchResults query={query} />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
