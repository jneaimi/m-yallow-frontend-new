export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL environment variable is not set');
  // Throw an error in production to fail fast, or provide a fallback
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
  }
}

export interface SearchOptions {
  query: string;
  limit?: number;
  token?: string | null;
  userId?: string | null;
}

/**
 * Track search activity for authenticated users
 * This function makes a lightweight fetch request to trigger activity logging
 */
export async function trackSearchActivity({ 
  query, 
  limit = 20, 
  token = null, 
  userId = null 
}: SearchOptions) {
  // If no authentication info, don't bother calling the API
  if (!token || !userId) {
    return null;
  }
  
  const apiEndpoint = `${API_BASE_URL}/public/providers/search?query=${encodeURIComponent(query)}&limit=1`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-User-ID': userId
  };
  
  try {
    // Use fetch with no-store to prevent caching
    // Keep limit=1 to minimize data transfer
    const response = fetch(apiEndpoint, { 
      headers,
      cache: 'no-store'
    });
    
    // Don't await the response or process it - we just want to trigger the backend logging
    return response;
  } catch (error) {
    console.error("Error tracking search activity:", error);
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