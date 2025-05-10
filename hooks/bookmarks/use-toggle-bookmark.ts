'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useBookmarkClient } from '@/lib/api/bookmarks/client';
import { useBookmarksList } from './use-bookmarks-list';

interface ToggleBookmarkResult {
  added: boolean;
  providerId: number;
}

/**
 * Hook to toggle bookmark status for a provider
 * Uses optimistic updates for a better user experience
 */
export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { isSignedIn } = useAuth();
  const bookmarkClient = useBookmarkClient();
  const { data: bookmarks = [] } = useBookmarksList();
  
  return useMutation({
    mutationFn: async (providerId: number): Promise<ToggleBookmarkResult> => {
      if (!isSignedIn) {
        toast.info('Please sign in to bookmark providers');
        throw new Error('User not signed in');
      }
      
      const isCurrentlyBookmarked = bookmarks.includes(providerId);
      
      if (isCurrentlyBookmarked) {
        await bookmarkClient.removeBookmark(providerId);
        return { added: false, providerId };
      } else {
        await bookmarkClient.addBookmark(providerId);
        return { added: true, providerId };
      }
    },
    onMutate: async (providerId) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.bookmarks.list() });
      
      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(queryKeys.bookmarks.list());
      
      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKeys.bookmarks.list(),
        (old: number[] = []) => {
          const isCurrentlyBookmarked = old.includes(providerId);
          if (isCurrentlyBookmarked) {
            return old.filter(id => id !== providerId);
          } else {
            return [...old, providerId];
          }
        }
      );
      
      // Return context object to use in onError
      return { previousBookmarks };
    },
    onSuccess: (result) => {
      if (result.added) {
        toast.success('Provider has been added to your bookmarks');
      } else {
        toast.success('Provider has been removed from your bookmarks');
      }
      
      // Invalidate the bookmarked providers query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['bookmarkedProviders'] });
    },
    onError: (error, providerId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKeys.bookmarks.list(), context?.previousBookmarks);
      toast.error('Failed to update bookmark. Please try again.');
    },
    onSettled: () => {
      // Always refetch after error or success to get a consistent state
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.list() });
    },
  });
}
