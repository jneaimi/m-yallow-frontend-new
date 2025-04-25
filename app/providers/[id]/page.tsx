import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";
import { getProviderHeroImageUrl, getFallbackImageUrl } from "@/lib/image-utils";

interface ProviderPageProps {
  params: { id: string };
}

async function getProvider(id: string) {
  // For development, use localhost API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${baseUrl}/providers/${id}`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch provider');
    }
    
    const provider = await res.json();
    // Map snake_case API fields to camelCase for the client component
    return {
      id: provider.id,
      name: provider.name,
      contact: provider.contact,
      location: provider.location,
      about: provider.about,
      heroImageUrl: provider.hero_image_url ? provider.hero_image_url : getProviderHeroImageUrl(provider.id),
      createdAt: provider.created_at,
    };
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error);
    // Continue to fallback data
  }
  
  // Fallback to mock data if API call fails
  const providerId = parseInt(id);
  if (providerId < 1 || providerId > 6) return null;
  
  // Mock data for fallback
  const mockProviders = [
    {
      id: 1,
      name: "Sunshine Wellness Center",
      contact: "contact@sunshinewellness.com",
      location: "123 Wellness Ave, Healthytown, CA",
      about: "Providing holistic wellness services with a focus on mental health and physical wellbeing. Our team of certified professionals offers a range of services including massage therapy, nutritional counseling, meditation classes, and personalized wellness plans.",
      heroImageUrl: getProviderHeroImageUrl(1),
      createdAt: "2023-11-01T12:00:00Z"
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      contact: "info@techsolutions.com",
      location: "456 Tech Blvd, Innovation City, NY",
      about: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
      heroImageUrl: getProviderHeroImageUrl(2),
      createdAt: "2023-10-15T09:30:00Z"
    }
  ];
  
  // Return mock data for the requested ID, or null if not found
  return mockProviders.find(p => p.id === providerId) || null;
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const awaitedParams = await params;
  const provider = await getProvider(awaitedParams.id);

  if (!provider) {
    notFound();
  }

  // Render the client component for interactive UI
  const ProviderDetailClient = (await import("@/components/providers/provider-detail-client")).ProviderDetailClient;
  return <ProviderDetailClient provider={provider} />;
}
