import { notFound } from "next/navigation";
import { PROVIDER_API, ApiProvider, transformProvider } from "@/lib/api/providers";

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

async function getProvider(id: string | number) {
  try {
    const url = PROVIDER_API.DETAIL(id);
    console.log(`Fetching provider from: ${url}`);
    
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch provider: ${res.status} ${res.statusText}`);
    }
    
    const provider = await res.json() as ApiProvider;
    console.log(`Provider data received:`, JSON.stringify(provider, null, 2));
    
    // Transform API provider to client provider format
    const transformedProvider = transformProvider(provider);
    return transformedProvider;
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error instanceof Error ? error.message : String(error));
    // Continue to fallback data
  }
  
  // Fallback to mock data if API call fails
  const providerId = typeof id === 'string' ? parseInt(id) : id;
  if (providerId < 1 || providerId > 2) return null;
  
  // Mock data for fallback
  const mockProviders = [
    {
      id: 1,
      name: "Sunshine Wellness Center",
      contact: "contact@sunshinewellness.com",
      location: "123 Wellness Ave, Healthytown, CA 94105, United States",
      about: "Providing holistic wellness services with a focus on mental health and physical wellbeing. Our team of certified professionals offers a range of services including massage therapy, nutritional counseling, meditation classes, and personalized wellness plans.",
      heroImageUrl: null,
      createdAt: "2023-11-01T12:00:00Z",
      street: "123 Wellness Ave",
      city: "Healthytown",
      state: "CA",
      postalCode: "94105",
      country: "United States",
      latitude: 37.789,
      longitude: -122.401,
      categories: [
        { id: 2, name: "Test Category 1", icon: "test-icon-1" },
        { id: 3, name: "Test Category 2", icon: "test-icon-1" }
      ]
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      contact: "info@techsolutions.com",
      location: "456 Tech Blvd, Innovation City, NY 10001, United States",
      about: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
      heroImageUrl: null,
      createdAt: "2023-10-15T09:30:00Z",
      street: "456 Tech Blvd",
      city: "Innovation City",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      latitude: 40.7128,
      longitude: -74.006,
      categories: [
        { id: 2, name: "Test Category 1", icon: "test-icon-1" }
      ]
    }
  ];
  
  // Return mock data for the requested ID, or null if not found
  return mockProviders.find(p => p.id === providerId) || null;
}

// Generate metadata for this page
export async function generateMetadata({ params }: ProviderPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const provider = await getProvider(resolvedParams.id);
  
  if (!provider) {
    return {
      title: 'Provider not found',
      description: 'The requested provider could not be found'
    };
  }

  return {
    title: `${provider.name} | Provider Profile`,
    description: provider.about ? 
      (provider.about.length > 160 ? `${provider.about.substring(0, 157)}...` : provider.about) 
      : `View details about ${provider.name}`,
    openGraph: {
      images: provider.heroImageUrl ? [provider.heroImageUrl] : []
    }
  };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const provider = await getProvider(resolvedParams.id);

  if (!provider) {
    notFound();
  }

  // Render the client component for interactive UI
  const ProviderDetailClient = (await import("@/components/providers/provider-detail-client")).ProviderDetailClient;
  return <ProviderDetailClient provider={provider} />;
}
