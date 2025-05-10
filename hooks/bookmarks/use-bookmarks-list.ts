'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useAuth } from '@clerk/nextjs';
import { useBookmarkClient } from '@/lib/api/bookmarks/client';

/**
 * Hook to fetch the list of bookmarked provider IDs
 * Uses TanStack Query for caching and state management
 */
export function useBookmarksList() {
  const { isSignedIn } = useAuth();
  const bookmarkClient = useBookmarkClient();
  
  return useQuery({
    queryKey: queryKeys.bookmarks.list(),
    queryFn: async () => {
      return bookmarkClient.getUserBookmarks();
    },
    enabled: !!isSignedIn, // Only run if user is signed in
    // Use the project's default staleTime from QueryClient configuration
  });
}
