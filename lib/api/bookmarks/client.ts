'use client';

import { useApiClient } from '@/lib/api-client/client';
import { useCallback, useMemo } from 'react'; // Import hooks

export const BOOKMARK_API = {
  LIST: '/providers/users/me/bookmarks',
  ADD: '/providers/users/me/bookmarks',
  DELETE: (providerId: number) => `/providers/users/me/bookmarks/${providerId}`,
};

/**
 * Client-side hook providing stable bookmark operation methods
 */
export interface ApiBookmark {
  provider_id: number;
  created_at: string;
}

export interface Bookmark {
  providerId: number;
  createdAt: string;
}

export function useBookmarkClient() {
  const getApiClient = useApiClient(); // Stable function from useApiClient

  const getUserBookmarks = useCallback(async (): Promise<number[]> => {
    const apiClient = await getApiClient();
    const response = await apiClient.get<{ bookmarks: ApiBookmark[], total: number }>(BOOKMARK_API.LIST);
    
    // Log the received data for debugging
    console.log('API Bookmark response:', response.data);
    
    // Handle different API response structures
    if (response.data?.bookmarks) {
      // If we get the expected structure with bookmarks array
      return response.data.bookmarks.map(bookmark => bookmark.provider_id || bookmark.id);
    } else if (Array.isArray(response.data)) {
      // If the API returns an array directly
      return response.data.map((id: number) => id);
    } else {
      // Fallback
      console.warn('Unexpected bookmark API response format:', response.data);
      return [];
    }
  }, [getApiClient]);

  const addBookmark = useCallback(async (providerId: number): Promise<void> => {
    console.log('Attempting to add bookmark for providerId:', providerId); // Log the ID
    const apiClient = await getApiClient();
    await apiClient.post(BOOKMARK_API.ADD, { provider_id: providerId });
  }, [getApiClient]);

  const removeBookmark = useCallback(async (providerId: number): Promise<void> => {
    const apiClient = await getApiClient();
    await apiClient.delete(BOOKMARK_API.DELETE(providerId));
  }, [getApiClient]);

  // Note: The original isBookmarked implementation fetches all bookmarks again.
  // This might be inefficient. Consider if this logic should live elsewhere or use cached state.
  // For now, just stabilizing the existing function.
  const isBookmarked = useCallback(async (providerId: number): Promise<boolean> => {
    const apiClient = await getApiClient();
    // Assuming the response structure is { bookmarks: [{id: number, ...}], total: number }
    const response = await apiClient.get<{ bookmarks: { id: number }[], total: number }>(BOOKMARK_API.LIST);
    const bookmarkIds = response.data?.bookmarks?.map(bookmark => bookmark.id) || [];
    return bookmarkIds.includes(providerId);
  }, [getApiClient]);

  // Memoize the returned object
  const client = useMemo(() => ({
    getUserBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  }), [getUserBookmarks, addBookmark, removeBookmark, isBookmarked]);

  return client;
}
