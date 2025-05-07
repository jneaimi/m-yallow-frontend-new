export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL environment variable is not set');
  // In production, we could throw an error or use a more specific fallback
}

export interface SearchOptions {
  query: string;
  limit?: number;
  token?: string | null;
  userId?: string | null;
}

/**
 * Track search activity without fetching full results
 * This function makes a GET request but ignores the response data
 */
export async function trackSearchActivity({ 
  query, 
  limit = 20, 
  token = null, 
  userId = null 
}: SearchOptions) {
  const apiEndpoint = `${API_BASE_URL}/public/providers/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth headers if available
  if (token && userId) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-User-ID'] = userId;
  }
  
  try {
    // Make a standard GET request but abort it once we get headers
    // This ensures the backend logs the search activity
    const controller = new AbortController();
    const signal = controller.signal;
    
    const response = fetch(apiEndpoint, { 
      method: 'GET',
      headers,
      signal
    });
    
    // Wait just enough for the request to be processed by the backend
    // Then abort to avoid downloading the entire response
    setTimeout(() => controller.abort(), 100);
    
    return response;
  } catch (error) {
    // AbortError is expected, so don't log it
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      console.error("Error tracking search activity:", error);
    }
    // We don't throw here to prevent blocking navigation
    return null;
  }
}

/**
 * Full search providers function
 * Use this when you need to get the actual search results
 */
export async function searchProviders({ 
  query, 
  limit = 20, 
  token = null, 
  userId = null 
}: SearchOptions) {
  const apiEndpoint = `${API_BASE_URL}/public/providers/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth headers if available
  if (token && userId) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-User-ID'] = userId;
  }
  
  try {
    const response = await fetch(apiEndpoint, { headers });
    
    if (!response.ok) {
      console.warn(`Search request failed with status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error("Error performing search:", error);
    throw error;
  }
}