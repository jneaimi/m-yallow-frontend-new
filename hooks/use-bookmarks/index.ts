'use client';

/**
 * @deprecated This file is kept for backward compatibility only.
 * Please import directly from '@/hooks/bookmarks' instead.
 * This re-export will be removed in a future update.
 */

// Re-export the hooks from the new location
export { useBookmarks } from '@/hooks/bookmarks';

// Retain default export for legacy callers
export { useBookmarks as default } from '@/hooks/bookmarks';
