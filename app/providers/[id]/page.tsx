import { notFound } from "next/navigation";
import { PROVIDER_API, ApiProvider, transformProvider } from "@/lib/api/providers";

interface ProviderPageProps {
  params: { id: string };
}

async function getProvider(id: string) {
  try {
    const res = await fetch(PROVIDER_API.DETAIL(id), { next: { revalidate: 60 } });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch provider: ${res.status} ${res.statusText}`);
    }
    
    const provider = await res.json() as ApiProvider;
    
    // Transform API provider to client provider format
    return transformProvider(provider);
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error instanceof Error ? error.message : String(error));
    // Continue to fallback data
  }
  
  // Fallback to mock data if API call fails
  const providerId = parseInt(id);
  if (providerId < 1 || providerId > 2) return null;
  
  // Mock data for fallback
  const mockProviders = [
    {
      id: 1,
      name: "Sunshine Wellness Center",
      contact: "contact@sunshinewellness.com",
      location: "123 Wellness Ave, Healthytown, CA",
      about: "Providing holistic wellness services with a focus on mental health and physical wellbeing. Our team of certified professionals offers a range of services including massage therapy, nutritional counseling, meditation classes, and personalized wellness plans.",
      heroImageUrl: null,
      createdAt: "2023-11-01T12:00:00Z",
      categories: [
        { id: 2, name: "Test Category 1", icon: "test-icon-1" },
        { id: 3, name: "Test Category 2", icon: "test-icon-1" }
      ]
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      contact: "info@techsolutions.com",
      location: "456 Tech Blvd, Innovation City, NY",
      about: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
      heroImageUrl: null,
      createdAt: "2023-10-15T09:30:00Z",
      categories: [
        { id: 2, name: "Test Category 1", icon: "test-icon-1" }
      ]
    }
  ];
  
  // Return mock data for the requested ID, or null if not found
  return mockProviders.find(p => p.id === providerId) || null;
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const provider = await getProvider(params.id);

  if (!provider) {
    notFound();
  }

  // Render the client component for interactive UI
  const ProviderDetailClient = (await import("@/components/providers/provider-detail-client")).ProviderDetailClient;
  return <ProviderDetailClient provider={provider} />;
}
