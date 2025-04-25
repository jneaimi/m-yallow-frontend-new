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
    return heroImageUrl;
  }
  
  // Make sure R2_PUBLIC_URL ends with a slash
  const baseUrl = R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL : `${R2_PUBLIC_URL}/`;
  
  // Otherwise, construct the URL based on the provider ID
  return `${baseUrl}providers/${providerId}/hero.jpg`;
}

/**
 * Get a fallback image URL if the primary image fails to load
 * @returns The URL for the fallback image
 */
export function getFallbackImageUrl(): string {
  return "/images/placeholder-provider.jpg";
}
