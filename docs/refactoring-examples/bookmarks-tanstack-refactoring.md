# Bookmarks TanStack Query Refactoring

This document details the refactoring of the bookmark functionality to use TanStack Query for improved data fetching, caching, and state management.

## Table of Contents

1. [Overview](#overview)
2. [Key Changes](#key-changes)
3. [New Hooks](#new-hooks)
4. [Component Updates](#component-updates)
5. [Best Practices](#best-practices)
6. [Migration Path](#migration-path)
7. [Testing Considerations](#testing-considerations)

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

## Best Practices

### Stable Query Keys

Always ensure that query keys remain stable across renders to prevent unnecessary refetches:

```typescript
// Bad - array identity changes on each render
queryKey: ['bookmarkedProviders', bookmarkIds],

// Good - array contents are sorted for stable identity
queryKey: ['bookmarkedProviders', [...bookmarkIds].sort()],

// Alternative - use an object if order matters
queryKey: ['bookmarkedProviders', { ids: bookmarkIds }],
```

### Typed Query Keys

Use constants and helper functions for query keys:

```typescript
// Define a constant
const BOOKMARKED_PROVIDERS_KEY = 'bookmarkedProviders';

// Use the constant in your query
queryKey: [BOOKMARKED_PROVIDERS_KEY, [...bookmarkIds].sort()],
```

### Query Key Accessors

Expose static methods to access query keys from outside the hook:

```typescript
// Add a static method to the hook
useBookmarkedProviders.getKey = () => [BOOKMARKED_PROVIDERS_KEY];

// In components that need to invalidate the query
queryClient.invalidateQueries({ queryKey: useBookmarkedProviders.getKey() });
```

### Targeted Refetching

Use proper query invalidation and refetching instead of brute-force page reloads:

```typescript
// Bad - reloads the entire page
window.location.reload();

// Good - refetches only the necessary data
const handleRetry = () => {
  queryClient.invalidateQueries({ queryKey: useBookmarkedProviders.getKey() });
  refetch();
};
```

### Optimistic Updates

Always implement optimistic updates for mutations to provide a better user experience:

```typescript
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
```

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
