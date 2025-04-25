import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { getProviderHeroImageUrl } from "@/lib/image-utils";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

async function searchProviders(query: string, category?: string) {
  // For development, use localhost API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    
    const res = await fetch(`${baseUrl}/providers?${params}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error('Failed to search providers');
    }
    
    const data = await res.json();
    
    // Define the API provider structure
    interface ApiProvider {
      id: number;
      name: string;
      contact?: string;
      location?: string;
      about?: string;
      hero_image_url?: string;
      created_at?: string;
    }
    
    // Map snake_case API fields to camelCase for the client component
    return (data.providers || []).map((provider: ApiProvider) => ({
      id: provider.id,
      name: provider.name,
      contact: provider.contact,
      location: provider.location,
      aboutSnippet: provider.about,
      heroImageUrl: provider.hero_image_url ? provider.hero_image_url : getProviderHeroImageUrl(provider.id),
      createdAt: provider.created_at,
    }));
  } catch (error) {
    console.error('Error searching providers:', error);
    
    // Return mock data as fallback
    return [
      {
        id: 1,
        name: "Sunshine Wellness Center",
        heroImageUrl: getProviderHeroImageUrl(1),
        aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing."
      },
      {
        id: 2,
        name: "Tech Solutions Inc",
        heroImageUrl: getProviderHeroImageUrl(2),
        aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity."
      },
      {
        id: 3,
        name: "Green Earth Landscaping",
        heroImageUrl: getProviderHeroImageUrl(3),
        aboutSnippet: "Sustainable landscaping and garden design with eco-friendly practices and native plant expertise."
      }
    ];
  }
}

async function SearchResults({ query, category }: { query?: string; category?: string }) {
  const providers = await searchProviders(query || "", category);
  
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
        />
      ))}
    </ResponsiveGrid>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Need to await searchParams in Next.js 14+
  const params = await searchParams;
  
  const query = params.q || "";
  const category = params.category;
  
  const title = category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Providers`
    : query 
      ? `Search results for "${query}"`
      : "All Providers";
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">{title}</h1>
          <SearchBar initialValue={query} />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Searching providers...</div>}>
          <SearchResults query={query} category={category} />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
