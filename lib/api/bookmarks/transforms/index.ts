'use client';

import { ApiProvider } from '@/lib/api/providers';

/**
 * Transformed and normalized provider data for use in the bookmarks components
 */
export interface BookmarkedProvider {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet: string;
  categories: string[];
  city: string;
  state: string;
}

/**
 * Transforms API provider data into a consistent format for the UI components
 * Handles null/undefined values and provides sensible defaults
 */
export function transformBookmarkedProvider(provider: ApiProvider): BookmarkedProvider {
  return {
    id: provider.id,
    name: provider.name || 'Unnamed Provider',
    heroImageUrl: provider.hero_image_url || `/images/placeholder-provider.jpg`,
    aboutSnippet: provider.about || '',
    categories: provider.categories
      ?.map(cat => cat.name || 'Uncategorized')
      .filter(Boolean) ?? [],
    city: provider.city || '',
    state: provider.state || '',
  };
}

/**
 * Transforms an array of API providers
 */
export function transformBookmarkedProviders(providers: ApiProvider[]): BookmarkedProvider[] {
  return providers.map(transformBookmarkedProvider);
}
