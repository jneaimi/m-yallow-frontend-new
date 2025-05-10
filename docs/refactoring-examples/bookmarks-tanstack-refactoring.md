# Bookmarks TanStack Query Refactoring

This document details the refactoring of the bookmark functionality to use TanStack Query for improved data fetching, caching, and state management.

## Table of Contents

1. [Overview](#overview)
2. [Key Changes](#key-changes)
3. [New Hooks](#new-hooks)
4. [Component Updates](#component-updates)
5. [Migration Path](#migration-path)
6. [Testing Considerations](#testing-considerations)

## Overview

The bookmark functionality has been refactored to use TanStack Query for improved data fetching, caching, and state management. This refactoring follows the project's patterns for TanStack Query implementation and aims to create a more maintainable and performant codebase.

## Key Changes

- Implemented dedicated TanStack Query hooks for bookmarks functionality
- Replaced manual state management with TanStack Query's built-in state management
- Added optimistic updates for a better user experience
- Improved error handling and loading states
- Maintained backward compatibility through a composite hook

## New Hooks

### `useBookmarksList`

This hook fetches the list of bookmarked provider IDs.

```typescript
const { data: bookmarks, isLoading, error } = useBookmarksList();
```

- `data`: An array of provider IDs that are bookmarked
- `isLoading`: Boolean indicating if the bookmarks are being fetched
- `error`: Any error that occurred during fetching
- `refetch`: Function to manually trigger a refetch

### `useBookmarkedProviders`

This hook fetches detailed provider information for bookmarked provider IDs.

```typescript
const { data: providers, isLoading, error } = useBookmarkedProviders();
```

- `data`: An array of provider objects with detailed information
- `isLoading`: Boolean indicating if the providers are being fetched
- `error`: Any error that occurred during fetching

### `useToggleBookmark`

This hook provides functionality to toggle bookmarks with optimistic updates.

```typescript
const toggleBookmarkMutation = useToggleBookmark();

// Later in a component
const handleToggle = async (providerId) => {
  await toggleBookmarkMutation.mutateAsync(providerId);
};
```

- `mutateAsync`: Function to toggle a bookmark status
- `isPending`: Boolean indicating if a mutation is in progress
- `error`: Any error that occurred during the mutation
- `variables`: The current provider ID being toggled (useful for showing loading state)

### Composite `useBookmarks` Hook

This hook maintains backward compatibility with the original API.

```typescript
const { bookmarks, isLoading, error, toggleBookmark, isBookmarked } = useBookmarks();
```

- Combines the functionality of the specialized hooks
- Provides the same interface as the original hook
- Uses TanStack Query under the hood for improved performance

## Component Updates

### `BookmarkButton`

- Now uses `useBookmarksList` and `useToggleBookmark` hooks
- Removed manual state management
- Uses TanStack Query's loading and error states
- Simplified the component logic

### `BookmarkedProviders`

- Now uses `useBookmarkedProviders` and `useToggleBookmark` hooks
- Removed manual data fetching and state management
- Improved loading and error handling
- More reactive to changes in bookmark status

## Migration Path

For existing components using the old `useBookmarks` hook:

1. **Option 1: Use the composite hook**
   - Continue using `useBookmarks` as before
   - The implementation will use TanStack Query under the hood

2. **Option 2: Migrate to specialized hooks**
   - Replace `useBookmarks` with the specific hooks you need
   - Update component logic to use TanStack Query patterns

Example of migrating a component:

```typescript
// Before
const { bookmarks, isLoading, toggleBookmark } = useBookmarks();

// After (with composite hook - easiest)
const { bookmarks, isLoading, toggleBookmark } = useBookmarks();
// No changes needed!

// After (with specialized hooks - recommended for new components)
const { data: bookmarks = [], isLoading } = useBookmarksList();
const toggleBookmarkMutation = useToggleBookmark();

// Then update usage
toggleBookmarkMutation.mutateAsync(providerId);
```

## Testing Considerations

When testing components using the new hooks:

1. **Mock TanStack Query Provider**
   - Use the `createWrapper` function from `@/test/utils`
   - Ensure QueryClient is properly provided in tests

2. **Test Loading States**
   - Verify components show appropriate loading indicators
   - Test error states and retry functionality

3. **Test Optimistic Updates**
   - Verify UI updates immediately on interaction
   - Test rollback behavior on API failures

Example:

```typescript
import { renderWithClient } from '@/test/utils';

test('BookmarkButton shows loading state', async () => {
  renderWithClient(<BookmarkButton providerId={1} />);
  
  // Test actions and assertions...
});
```

## Conclusion

This refactoring greatly improves the bookmark functionality by leveraging TanStack Query's capabilities. It maintains backward compatibility while providing a better foundation for future development.
