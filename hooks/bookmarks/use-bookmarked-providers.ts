'use client';

import { useQuery } from '@tanstack/react-query';
import { useBookmarksList } from './use-bookmarks-list';
import { createApiClient } from '@/lib/api-client';
import { PROVIDER_API, ApiProvider } from '@/lib/api/providers';

/**
 * Hook to fetch detailed provider information for bookmarked provider IDs
 * Depends on useBookmarksList for the IDs
 */
export function useBookmarkedProviders() {
  const { data: bookmarkIds = [], isLoading: isLoadingBookmarks } = useBookmarksList();
  
  return useQuery({
    queryKey: ['bookmarkedProviders', bookmarkIds],
    queryFn: async () => {
      if (bookmarkIds.length === 0) {
        return [];
      }
      
      const apiClient = await createApiClient();
      // Fetch details for each bookmarked provider
      const providerPromises = bookmarkIds.map(id => 
        apiClient.get(PROVIDER_API.DETAIL(id))
          .then(response => response.data)
          .catch(error => {
            console.error(`Failed to fetch provider ${id}:`, error);
            return null;
          })
      );
      
      const results = await Promise.all(providerPromises);
      return results.filter(Boolean) as ApiProvider[]; // Filter out any failed requests
    },
    enabled: !isLoadingBookmarks && bookmarkIds.length > 0,
  });
}
