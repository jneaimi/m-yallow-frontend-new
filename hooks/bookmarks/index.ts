'use client';

import { useMemo } from 'react';
import { useBookmarksList } from './use-bookmarks-list';
import { useToggleBookmark } from './use-toggle-bookmark';

/**
 * Composite hook that provides a similar interface to the original useBookmarks hook
 * This ensures backward compatibility while leveraging TanStack Query for data fetching
 */
export function useBookmarks() {
  const { 
    data: bookmarks = [], 
    isLoading, 
    error,
    refetch: fetchBookmarks 
  } = useBookmarksList();
  
  const toggleBookmarkMutation = useToggleBookmark();
  
  // Create a memoized interface that matches the original hook
  const bookmarksInterface = useMemo(() => ({
    bookmarks,
    isLoading: isLoading || toggleBookmarkMutation.isPending,
    error: error || toggleBookmarkMutation.error,
    toggleBookmark: (providerId: number) => toggleBookmarkMutation.mutateAsync(providerId),
    isBookmarked: (providerId: number) => bookmarks.includes(providerId),
    fetchBookmarks,
  }), [
    bookmarks, 
    isLoading, 
    error, 
    toggleBookmarkMutation.mutateAsync,
    toggleBookmarkMutation.isPending,
    toggleBookmarkMutation.error,
    fetchBookmarks
  ]);
  
  return bookmarksInterface;
}

// Re-export the individual hooks for direct usage
export * from './use-bookmarks-list';
export * from './use-bookmarked-providers';
export * from './use-toggle-bookmark';
