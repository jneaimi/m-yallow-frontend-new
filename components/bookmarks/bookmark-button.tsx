'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkX } from 'lucide-react';
import { toast } from "sonner";
import { useBookmarks } from '@/hooks/use-bookmarks';

interface BookmarkButtonProps {
  providerId: number;
  initialIsBookmarked?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
}

export function BookmarkButton({
  providerId,
  initialIsBookmarked,
  onToggle,
}: BookmarkButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const { isBookmarked, toggleBookmark, bookmarks } = useBookmarks();
  
  // Track the bookmark state locally, initialized with the correct value
  const [isCurrentlyBookmarked, setIsCurrentlyBookmarked] = useState(
    initialIsBookmarked !== undefined ? initialIsBookmarked : isBookmarked(providerId)
  );
  
  // Update local state when the bookmarks array changes
  useEffect(() => {
    setIsCurrentlyBookmarked(isBookmarked(providerId));
  }, [bookmarks, isBookmarked, providerId]);

  const handleToggle = async () => {
    setIsPending(true);
    try {
      await toggleBookmark(providerId);
      // Update the local state immediately for better user feedback
      const newState = !isCurrentlyBookmarked;
      setIsCurrentlyBookmarked(newState);
      onToggle?.(newState);
    } catch (error) {
      toast.error('Failed to update bookmark status');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isCurrentlyBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isPending ? (
        <div className="flex items-center">
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
          {isCurrentlyBookmarked ? 'Removing...' : 'Saving...'}
        </div>
      ) : isCurrentlyBookmarked ? (
        <>
          <BookmarkX className="w-4 h-4 mr-2" />
          Unsave
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 mr-2" />
          Save
        </>
      )}
    </Button>
  );
}
