import { PROVIDER_API, ProvidersListResponse, transformProvider, Provider } from '../providers';
import { getFallbackImageUrl } from '@/lib/image-utils';

export interface ProviderListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  location?: string;
  category?: string;
}

/**
 * Client-side response interface after providers transformation
 */
export interface ProvidersListClientResponse {
  providers: Provider[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Fetches the list of providers from the API with pagination
 * Falls back to mock data if the API call fails
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Processed provider data with pagination info
 */
export async function fetchProvidersList({
  page = 1, 
  pageSize = 12,
  name = '',
  location = '',
  category = ''
}: ProviderListParams = {}): Promise<ProvidersListClientResponse> {
  try {
    // Create query parameters - only include non-empty filter params
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    
    // Only append non-empty filter parameters
    if (name) params.append("name", name);
    if (location) params.append("location", location);
    if (category) params.append("category", category);
    
    const res = await fetch(
      `${PROVIDER_API.PUBLIC}?${params}`
    );
    
    if (!res.ok) {
      console.warn(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch providers list: ${res.status} ${res.statusText}`);
    }
    
    let data: ProvidersListResponse;
    try {
      data = await res.json() as ProvidersListResponse;
    } catch (parseError) {
      console.error('Failed to parse providers list response:', parseError);
      throw new Error('Failed to parse response data');
    }
    
    // Transform API providers to client provider format
    const processedProviders = data.providers.map(transformProvider);
    
    const response: ProvidersListClientResponse = {
      providers: processedProviders,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize
    };
    
    return response;
  } catch (error) {
    console.error('Error fetching providers list:', error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    const fallback: ProvidersListClientResponse = {
      providers: [
        {
          id: 1,
          name: "Sunshine Wellness Center",
          contact: null,
          location: null,
          heroImageUrl: getFallbackImageUrl(), // Using a proper fallback image URL
          aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing.",
          createdAt: new Date().toISOString(),
          categories: [
            { id: 2, name: "Test Category 1", icon: "test-icon-1" }
          ]
        },
        {
          id: 2,
          name: "Tech Solutions Inc",
          contact: null,
          location: null,
          heroImageUrl: getFallbackImageUrl(),
          aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
          createdAt: new Date().toISOString(),
          categories: [
            { id: 3, name: "Test Category 2", icon: "test-icon-1" }
          ]
        },
        {
          id: 3,
          name: "Green Earth Landscaping",
          contact: null,
          location: null,
          heroImageUrl: getFallbackImageUrl(),
          aboutSnippet: "Sustainable landscaping and garden design with eco-friendly practices and native plant expertise.",
          createdAt: new Date().toISOString(),
          categories: [
            { id: 2, name: "Test Category 1", icon: "test-icon-1" },
            { id: 3, name: "Test Category 2", icon: "test-icon-1" }
          ]
        }
      ],
      total: 3,
      page,
      pageSize
    };
    
    return fallback;
  }
}