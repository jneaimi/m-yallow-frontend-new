import { getProviderHeroImageUrl } from "@/lib/image-utils";

// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Provider API endpoints
export const PROVIDER_API = {
  LIST: `${API_BASE_URL}/providers`,
  SEARCH: `${API_BASE_URL}/providers/search`,
  RECENT: `${API_BASE_URL}/providers/recent`,
  DETAIL: (id: string | number) => `${API_BASE_URL}/providers/${id}`,
  CONTACT: (id: string | number) => `${API_BASE_URL}/providers/${id}/contact`
};

// API Interfaces
export interface ApiCategory {
  id: number;
  name: string;
  icon: string;
}

export interface ApiProvider {
  id: number;
  name: string;
  contact?: string;
  location?: string;
  about?: string;
  latitude?: number;
  longitude?: number;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  category_ids?: number[] | null;
  owner_id?: string;
  hero_image_url?: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
  categories?: ApiCategory[];
}

// Client-side interfaces
export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Provider {
  id: number;
  name: string;
  contact?: string;
  location?: string;
  aboutSnippet?: string;
  about?: string;
  heroImageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  // Address components
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Geographic coordinates
  latitude?: number;
  longitude?: number;
  // Categories
  categories?: Category[];
}

// Response interface for list endpoint
export interface ProvidersListResponse {
  providers: ApiProvider[];
  total: number;
  page: number;
  pageSize: number;
}

// Response interface for recent providers endpoint
export interface RecentProvider {
  id: number;
  name: string;
  heroImageUrl: string | null;
  aboutSnippet: string;
}

/**
 * Transform API provider to client provider
 * @param apiProvider The provider data from the API
 * @returns Transformed provider for client components
 */
export function transformProvider(apiProvider: ApiProvider): Provider {
  // Log the structure of the API provider object
  console.log("Transforming provider:", JSON.stringify(apiProvider, null, 2));
  
  // Ensure we have a valid object
  if (!apiProvider || typeof apiProvider !== 'object') {
    console.error("Invalid provider data:", apiProvider);
    return {
      id: 0,
      name: "Unknown Provider",
      heroImageUrl: getFallbackImageUrl(),
    };
  }
  
  return {
    id: apiProvider.id,
    name: apiProvider.name || "Unnamed Provider",
    contact: apiProvider.contact,
    location: apiProvider.location,
    aboutSnippet: apiProvider.about,
    about: apiProvider.about,
    heroImageUrl: apiProvider.hero_image_url ? apiProvider.hero_image_url : getProviderHeroImageUrl(apiProvider.id),
    createdAt: apiProvider.created_at,
    updatedAt: apiProvider.updated_at,
    // Address components
    street: apiProvider.street,
    city: apiProvider.city,
    state: apiProvider.state,
    postalCode: apiProvider.postal_code,
    country: apiProvider.country,
    // Geographic coordinates
    latitude: apiProvider.latitude,
    longitude: apiProvider.longitude,
    // Categories
    categories: Array.isArray(apiProvider.categories) ? apiProvider.categories : []
  };
}

/**
 * Transform recent provider from API to client format
 * @param provider The recent provider data from the API
 * @returns Transformed recent provider for client components
 */
export function transformRecentProvider(provider: RecentProvider): Provider {
  return {
    id: provider.id,
    name: provider.name,
    aboutSnippet: provider.aboutSnippet,
    heroImageUrl: provider.heroImageUrl || getProviderHeroImageUrl(provider.id)
  };
}
