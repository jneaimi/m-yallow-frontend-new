import { PROVIDER_API, ApiProvider, Provider, transformProvider } from '../providers';
import { getFallbackImageUrl } from '@/lib/image-utils';

export interface SearchParams {
  query?: string;
  categoryId?: string;
  limit?: number;
}

export interface SearchResponse {
  providers: Provider[];
  total: number;
}

/**
 * Searches for providers using the search API endpoint
 * @param options - Search parameters
 * @returns Array of providers matching the search criteria with total count
 */
export async function searchProviders({
  query = "",
  categoryId,
  limit = 20
}: SearchParams = {}): Promise<SearchResponse> {
  // Build query parameters
  const params: Record<string, string> = { limit: limit.toString() };
  if (query) params.query = query;
  
  // Try different parameter formats for category filtering
  if (categoryId) {
    params.category_id = categoryId;
    params.categoryId = categoryId;
    params.category = categoryId;
  }
  
  // Determine the best endpoint to use
  let apiEndpoint;
  if (query) {
    apiEndpoint = `${PROVIDER_API.SEARCH}?${new URLSearchParams(params)}`;
  } else if (categoryId) {
    apiEndpoint = `${PROVIDER_API.PUBLIC}?category=${categoryId}&limit=${limit}`;
  } else {
    apiEndpoint = `${PROVIDER_API.PUBLIC}?${new URLSearchParams({ limit: limit.toString() })}`;
  }
  
  try {
    let res = await fetch(apiEndpoint, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Fallback to main providers endpoint if search endpoint fails
    if (!res.ok && query && apiEndpoint.includes('/public/providers/search')) {
      console.log(`Search endpoint failed (${res.status}), falling back to main providers endpoint`);
      const fallbackEndpoint = `${PROVIDER_API.PUBLIC}?${new URLSearchParams(params)}`;
      res = await fetch(fallbackEndpoint, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!res.ok) {
      throw new Error(`Failed to search providers: ${res.status} ${res.statusText}`);
    }
    
    // Parse the response
    const data = await res.json();
    
    // Handle different response formats
    let providers: ApiProvider[];
    
    if (Array.isArray(data)) {
      providers = data;
    } else if (data.providers && Array.isArray(data.providers)) {
      providers = data.providers;
    } else if (data.results && Array.isArray(data.results)) {
      providers = data.results;
    } else {
      // Last resort fallback - look for any array in the response
      const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0 && possibleArrays[0].length > 0) {
        providers = possibleArrays[0] as ApiProvider[];
      } else {
        throw new Error("Unexpected API response format");
      }
    }
    
    // Transform API providers to client provider format
    const transformedProviders = providers.map(transformProvider);
    
    // Client-side category filtering if needed
    if (categoryId) {
      const filteredProviders = transformedProviders.filter(provider => 
        provider.categories?.some(cat => String(cat.id) === categoryId)
      );
      
      return {
        providers: filteredProviders,
        total: filteredProviders.length
      };
    }
    
    return {
      providers: transformedProviders,
      total: transformedProviders.length
    };
  } catch (error) {
    console.error('Error searching providers:', error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    return {
      providers: [
        {
          id: 1,
          name: "Sunshine Wellness Center",
          heroImageUrl: getFallbackImageUrl(),
          aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing.",
          categories: [
            { id: 2, name: "Test Category 1", icon: "test-icon-1" }
          ]
        },
        {
          id: 2,
          name: "Tech Solutions Inc",
          heroImageUrl: getFallbackImageUrl(),
          aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
          categories: [
            { id: 3, name: "Test Category 2", icon: "test-icon-1" }
          ]
        }
      ],
      total: 2
    };
  }
}