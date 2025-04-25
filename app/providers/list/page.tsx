import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { getProviderHeroImageUrl } from "@/lib/image-utils";

interface ListPageProps {
  searchParams: { page?: string; pageSize?: string };
}

async function getProvidersList(page: number = 1, pageSize: number = 12) {
  // For development, use localhost API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(
      `${baseUrl}/providers?page=${page}&pageSize=${pageSize}`,
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch providers list');
    }
    
    const data = await res.json();
    // Map snake_case API fields to camelCase for the client component
    const processedProviders = data.providers.map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      contact: provider.contact,
      location: provider.location,
      aboutSnippet: provider.about,
      heroImageUrl: provider.hero_image_url ? provider.hero_image_url : getProviderHeroImageUrl(provider.id),
      createdAt: provider.created_at,
    }));
    
    return {
      providers: processedProviders,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize
    };
  } catch (error) {
    console.error('Error fetching providers list:', error);
    
    // Return mock data as fallback
    return {
      providers: [
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
      ],
      total: 3,
      page: page,
      pageSize: pageSize
    };
  }
}

async function ProvidersList({ page, pageSize }: { page: number; pageSize: number }) {
  const { providers, total } = await getProvidersList(page, pageSize);
  
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later
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

export default function ListPage({ searchParams }: ListPageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "12");
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">All Providers</h1>
          <SearchBar />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Loading providers...</div>}>
          <ProvidersList page={page} pageSize={pageSize} />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
