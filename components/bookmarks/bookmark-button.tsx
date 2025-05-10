'use client';

import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkX } from 'lucide-react';
import { useBookmarksList, useToggleBookmark } from '@/hooks/bookmarks';

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
  const { data: bookmarks = [] } = useBookmarksList();
  const toggleBookmarkMutation = useToggleBookmark();
  
  // Use the bookmarks data or fall back to initialIsBookmarked if provided
  const isBookmarked = initialIsBookmarked !== undefined
    ? initialIsBookmarked
    : bookmarks.includes(providerId);

  const handleToggle = async () => {
    try {
      await toggleBookmarkMutation.mutateAsync(providerId);
      onToggle?.(!isBookmarked);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={toggleBookmarkMutation.isPending}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {toggleBookmarkMutation.isPending ? (
        <div className="flex items-center">
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
          {isBookmarked ? 'Removing...' : 'Saving...'}
        </div>
      ) : isBookmarked ? (
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
