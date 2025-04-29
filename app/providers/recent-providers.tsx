import { ProvidersGrid } from "@/components/providers/providers-grid";
import { PROVIDER_API, RecentProvider, Provider, transformRecentProvider } from "@/lib/api/providers";

async function getRecentProviders(limit: number = 6): Promise<Provider[]> {
  try {
    const res = await fetch(`${PROVIDER_API.RECENT}?limit=${limit}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error('Failed to fetch recent providers');
    }
    
    // Use the updated API response format
    const providers = await res.json() as RecentProvider[];
    
    // Transform providers for client components
    return providers.map(transformRecentProvider);
  } catch (error) {
    console.error('Error fetching recent providers:', error);
    
    // Return mock data as fallback
    return [
      {
        id: 1,
        name: "Sunshine Wellness Center",
        heroImageUrl: null,
        aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing."
      },
      {
        id: 2,
        name: "Tech Solutions Inc",
        heroImageUrl: null,
        aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity."
      },
      {
        id: 3,
        name: "Green Earth Landscaping",
        heroImageUrl: null,
        aboutSnippet: "Sustainable landscaping and garden design with eco-friendly practices and native plant expertise."
      }
    ].map(transformRecentProvider);
  }
}

export async function RecentProviders() {
  const providers = await getRecentProviders();
  return <ProvidersGrid providers={providers} />;
}
