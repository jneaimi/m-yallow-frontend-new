import { createServerApiClient } from '@/lib/api-client/server';
import 'server-only';

export const BOOKMARK_API = {
  LIST: '/users/me/bookmarks',
  ADD: '/users/me/bookmarks',
  DELETE: (providerId: number) => `/users/me/bookmarks/${providerId}`,
};

export interface Bookmark {
  providerId: number;
  createdAt: string;
}

/**
 * Fetch all bookmarks for the current authenticated user
 * @returns Array of provider IDs that the user has bookmarked
 */
export async function getUserBookmarks(): Promise<number[]> {
  const apiClient = await createServerApiClient();
  const response = await apiClient.get(BOOKMARK_API.LIST);
  return response.data;
}

/**
 * Add a provider to the current user's bookmarks
 * @param providerId The ID of the provider to bookmark
 */
export async function addBookmark(providerId: number): Promise<void> {
  const apiClient = await createServerApiClient();
  await apiClient.post(BOOKMARK_API.ADD, { provider_id: providerId });
}

/**
 * Remove a provider from the current user's bookmarks
 * @param providerId The ID of the provider to remove from bookmarks
 */
export async function removeBookmark(providerId: number): Promise<void> {
  const apiClient = await createServerApiClient();
  await apiClient.delete(BOOKMARK_API.DELETE(providerId));
}
