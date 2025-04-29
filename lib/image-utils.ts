/**
 * Utility functions for handling images in the application
 */

// Base URL for Cloudflare R2 bucket
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || "https://img.bfori.com/";

/**
 * Get the full URL for a provider hero image
 * @param providerId - The ID of the provider
 * @param heroImageUrl - Optional direct URL from API
 * @returns The full URL for the provider's hero image
 */
export function getProviderHeroImageUrl(providerId: number | string, heroImageUrl?: string | null): string {
  // If a direct URL is provided by the API, use it
  if (heroImageUrl) {
    // Check if it's already a full URL
    if (heroImageUrl.startsWith('http://') || heroImageUrl.startsWith('https://')) {
      return heroImageUrl;
    }
    
    // Handle relative paths using the API base URL
    if (heroImageUrl.startsWith('/')) {
      // Extract the origin from the API_BASE_URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiOrigin = apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
      return `${apiOrigin}${heroImageUrl}`;
    }
  }
  
  // Make sure R2_PUBLIC_URL ends with a slash
  const baseUrl = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL : `${R2_PUBLIC_URL}/`;
  
  // Otherwise, construct the URL based on the provider ID
  return `${baseUrl}${providerId}/hero.jpg`;
}

/**
 * Get a fallback image URL if the primary image fails to load
 * @returns The URL for the fallback image
 */
export function getFallbackImageUrl(): string {
  return "/images/placeholder-provider.jpg";
}
