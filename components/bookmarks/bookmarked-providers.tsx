'use client';

import { useBookmarkedProviders, useToggleBookmark } from '@/hooks/bookmarks';
import { useQueryClient } from '@tanstack/react-query';
import { BookmarkedProvidersList } from './bookmarked-providers-list';
import { transformBookmarkedProviders } from '@/lib/api/bookmarks/transforms';

/**
 * Container component that handles data fetching and state management
 * Uses the BookmarkedProvidersList for presentation
 */
export function BookmarkedProviders() {
  const queryClient = useQueryClient();
  const { 
    data: apiProviders = [], 
    isLoading, 
    error, 
    refetch 
  } = useBookmarkedProviders();
  
  const toggleBookmarkMutation = useToggleBookmark();
  
  // Transform API data to component-friendly format
  const providers = transformBookmarkedProviders(apiProviders);
  
  // Function to handle retrying the query when it fails
  const handleRetry = () => {
    // Invalidate and refetch the bookmarked providers query
    queryClient.invalidateQueries({ queryKey: useBookmarkedProviders.getKey() });
    refetch();
  };

  // Function to handle removing a bookmark
  const handleRemoveBookmark = async (providerId: number) => {
    try {
      await toggleBookmarkMutation.mutateAsync(providerId);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };
  
  // Function to determine if a provider is currently being removed
  const isRemoving = (providerId: number) => {
    return toggleBookmarkMutation.isPending && 
      toggleBookmarkMutation.variables === providerId;
  };

  return (
    <BookmarkedProvidersList
      providers={providers}
      isLoading={isLoading}
      error={error as Error | null}
      onRetry={handleRetry}
      onRemoveBookmark={handleRemoveBookmark}
      isRemoving={isRemoving}
    />
  );
}
