import { ProvidersGrid } from "@/components/providers/providers-grid";
import { getProviderHeroImageUrl } from "@/lib/image-utils";

interface Provider {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet: string;
}

async function getRecentProviders(limit: number = 6): Promise<Provider[]> {
  // For development, use localhost API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${baseUrl}/providers/recent?limit=${limit}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error('Failed to fetch recent providers');
    }
    
    const providers = await res.json();
    
    // Process the providers to ensure heroImageUrl is handled correctly
    return providers.map((provider: Provider) => ({
      ...provider,
      // Use the utility function to handle the heroImageUrl
      heroImageUrl: provider.heroImageUrl ? provider.heroImageUrl : getProviderHeroImageUrl(provider.id)
    }));
  } catch (error) {
    console.error('Error fetching recent providers:', error);
    
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

export async function RecentProviders() {
  const providers = await getRecentProviders();
  return <ProvidersGrid providers={providers} />;
}
