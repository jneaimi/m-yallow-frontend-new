# Dashboard Bookmarks TanStack Query Refactoring

This document details the refactoring of the dashboard bookmarks feature to use TanStack Query for improved data fetching, caching, and state management, following a more modular approach with better separation of concerns.

## Table of Contents

1. [Overview](#overview)
2. [Key Changes](#key-changes)
3. [Component Updates](#component-updates)
4. [Data Transformation Layer](#data-transformation-layer)
5. [Query Key Management](#query-key-management)
6. [Error Handling Improvements](#error-handling-improvements)
7. [Testing Strategy](#testing-strategy)
8. [Best Practices Applied](#best-practices-applied)

## Overview

The dashboard bookmarks feature has been refactored to improve maintainability, type safety, and performance by following a more modular approach with clear separation of concerns. While the feature was already using TanStack Query, this refactoring builds on that foundation to create a more structured and robust implementation.

## Key Changes

- **Improved separation of concerns** with dedicated presentation and container components
- **Added data transformation layer** for consistent data structures and better type safety
- **Enhanced error handling** with more specific error messages
- **Central query key management** using the shared `queryKeys` object
- **Comprehensive test coverage** for both presentation and container components

## Component Updates

### Presentation and Container Pattern

The original `BookmarkedProviders` component was doing too much - both fetching data and rendering the UI. This has been split into:

1. **`BookmarkedProvidersList`** (Presentation Component)
   - Focuses solely on rendering the UI based on props
   - Handles different states: loading, error, empty, populated
   - No direct data fetching or state management

2. **`BookmarkedProviders`** (Container Component)
   - Handles data fetching and state management
   - Uses TanStack Query hooks to get and manage data
   - Passes data and callbacks to the presentation component

This separation makes the components easier to test and maintain.

**Before:**
```tsx
export function BookmarkedProviders() {
  const { data: providers = [], isLoading, error, refetch } = useBookmarkedProviders();
  const toggleBookmarkMutation = useToggleBookmark();
  
  // Function to handle retrying the query when it fails
  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: useBookmarkedProviders.getKey() });
    refetch();
  };

  // Function to handle removing a bookmark directly from this view
  const handleRemoveBookmark = async (providerId: number) => {
    try {
      await toggleBookmarkMutation.mutateAsync(providerId);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  if (isLoading) {
    // Render loading state
  }

  if (error) {
    // Render error state
  }

  if (providers.length === 0) {
    // Render empty state
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {providers.map(provider => {
        // Inline data transformations
        const heroImageUrl = provider.hero_image_url || `/images/placeholder-provider.jpg`;
        
        return (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name || 'Unnamed Provider'}
            heroImageUrl={heroImageUrl}
            aboutSnippet={provider.about}
            categories={provider.categories || []}
            city={provider.city}
            state={provider.state}
            onRemoveBookmark={handleRemoveBookmark}
            showBookmarkButton={true}
            isRemoving={toggleBookmarkMutation.isPending && 
              toggleBookmarkMutation.variables === provider.id}
          />
        );
      })}
    </div>
  );
}
```

**After:**
```tsx
// Container component
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
```

## Data Transformation Layer

To ensure consistent data structures and better type safety, a dedicated transformation layer was added:

```typescript
// lib/api/bookmarks/transforms/index.ts
export interface BookmarkedProvider {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet: string;
  categories: string[];
  city: string;
  state: string;
}

export function transformBookmarkedProvider(provider: ApiProvider): BookmarkedProvider {
  return {
    id: provider.id,
    name: provider.name || 'Unnamed Provider',
    heroImageUrl: provider.hero_image_url || `/images/placeholder-provider.jpg`,
    aboutSnippet: provider.about || '',
    categories: provider.categories || [],
    city: provider.city || '',
    state: provider.state || '',
  };
}

export function transformBookmarkedProviders(providers: ApiProvider[]): BookmarkedProvider[] {
  return providers.map(transformBookmarkedProvider);
}
```

Benefits of this approach:
- Consistent data structures throughout the application
- Centralized handling of null/undefined values
- Better type safety with explicit interfaces
- Easier to maintain and update when API changes

## Query Key Management

The refactoring improved query key management by:

1. **Adding a dedicated query key for bookmarked providers detail**:
```typescript
// In queryKeys.ts
bookmarks: {
  all: ['bookmarks'] as const,
  list: () => [...queryKeys.bookmarks.all, 'list'] as const,
  detail: () => [...queryKeys.bookmarks.all, 'detail'] as const, // New
},
```

2. **Updating the hook to use this central query key**:
```typescript
// In useBookmarkedProviders.ts
useBookmarkedProviders.getKey = () => queryKeys.bookmarks.detail();

return useQuery({
  queryKey: [...queryKeys.bookmarks.detail(), [...bookmarkIds].sort()],
  // Rest of implementation...
});
```

Benefits:
- Consistent query key structure throughout the application
- Easier to invalidate related queries
- Better organization and discoverability

## Error Handling Improvements

Error handling was enhanced to provide more specific error messages:

```typescript
// In useToggleBookmark.ts
mutationFn: async (providerId: number): Promise<ToggleBookmarkResult> => {
  if (!isSignedIn) {
    toast.info('Please sign in to bookmark providers');
    throw new Error('User not signed in');
  }
  
  const isCurrentlyBookmarked = bookmarks.includes(providerId);
  
  try {
    if (isCurrentlyBookmarked) {
      await bookmarkClient.removeBookmark(providerId);
      return { added: false, providerId };
    } else {
      await bookmarkClient.addBookmark(providerId);
      return { added: true, providerId };
    }
  } catch (error) {
    console.error('Bookmark operation failed:', error);
    
    // Provide more specific error messages based on the operation type
    const message = isCurrentlyBookmarked 
      ? 'Failed to remove bookmark. Please try again.'
      : 'Failed to add bookmark. Please try again.';
      
    toast.error(message);
    throw error;
  }
}
```

Also, the `onError` callback was updated to avoid duplicate error messages:

```typescript
onError: (error, providerId, context) => {
  // If the mutation fails, use the context returned from onMutate to roll back
  queryClient.setQueryData(queryKeys.bookmarks.list(), context?.previousBookmarks);
  
  // Error message is now handled in the mutationFn to provide more specific feedback
  // This prevents duplicate error messages
},
```

Benefits:
- More specific error messages for users
- Better debugging information for developers
- No duplicate error messages
- Proper rollback of optimistic updates

## Testing Strategy

A comprehensive testing strategy was implemented with tests for both presentation and container components:

1. **Presentation Component Testing**:
   - Tests for all states: loading, error, empty, populated
   - Tests for user interactions like removing bookmarks
   - Ensures visual elements render correctly

2. **Container Component Testing**:
   - Tests for proper data transformation
   - Tests for correct props passing to presentation component
   - Ensures proper interaction with TanStack Query hooks

This approach ensures high test coverage and helps catch regressions.

## Best Practices Applied

Several best practices were applied in this refactoring:

1. **Separation of Concerns**:
   - Presentation and container components
   - Data fetching and UI rendering
   - Data transformation and state management

2. **Type Safety**:
   - Explicit interfaces for data structures
   - Proper typing for function parameters and returns
   - Type-safe query keys

3. **Code Reusability**:
   - Shared transformation functions
   - Reusable hooks and utilities
   - Consistent patterns across components

4. **Performance Optimization**:
   - Proper memoization of expensive operations
   - Stable query keys to prevent unnecessary refetches
   - Targeted invalidation of queries

5. **Developer Experience**:
   - Clear and consistent naming
   - Well-documented code
   - Easy-to-understand component structure

## Conclusion

This refactoring enhances the dashboard bookmarks feature by improving separation of concerns, type safety, error handling, and testability. By following established patterns and best practices, it creates a more maintainable, robust, and performant implementation that will be easier to extend and enhance in the future.
