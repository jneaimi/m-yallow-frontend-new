'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from "sonner";
import { useBookmarkClient } from '@/lib/api/bookmarks/client';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const bookmarkClient = useBookmarkClient();

  const toggleBookmark = useCallback(async (providerId: number) => {
    if (!isSignedIn) {
      toast.info('Please sign in to bookmark providers');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isCurrentlyBookmarked = bookmarks.includes(providerId);
      
      if (isCurrentlyBookmarked) {
        await bookmarkClient.removeBookmark(providerId);
        setBookmarks(prev => prev.filter(id => id !== providerId));
        toast.success('Provider has been removed from your bookmarks');
      } else {
        await bookmarkClient.addBookmark(providerId);
        setBookmarks(prev => [...prev, providerId]);
        toast.success('Provider has been added to your bookmarks');
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setError('Failed to update bookmark');
      toast.error('Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [bookmarks, isSignedIn, bookmarkClient]);

  const fetchBookmarks = useCallback(async () => {
    if (!isSignedIn) {
      setBookmarks([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedBookmarks = await bookmarkClient.getUserBookmarks();
      setBookmarks(fetchedBookmarks);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setError('Failed to load your bookmarks');
      // Avoid duplicate toast if error occurs during initial load
      // toast.error('Failed to load your bookmarks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, bookmarkClient]);

  // Load bookmarks on initial mount and when fetchBookmarks changes
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    toggleBookmark,
    isBookmarked: (providerId: number) => bookmarks.includes(providerId),
    fetchBookmarks,
  };
}
