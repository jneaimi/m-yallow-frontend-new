# TanStack Query Patterns

This document outlines the recommended patterns and best practices for implementing TanStack Query in the M-Yallow Frontend project. Following these patterns will ensure consistency across the codebase and make it easier for the team to maintain and extend the application.

## Table of Contents

1. [Query Key Patterns](#query-key-patterns)
2. [Folder Structure](#folder-structure)
3. [Custom Hook Patterns](#custom-hook-patterns)
4. [Mutation Patterns](#mutation-patterns)
5. [SSR Patterns](#ssr-patterns)
6. [Testing Patterns](#testing-patterns)
7. [Type-Safety Patterns](#type-safety-patterns)

## Query Key Patterns

Query keys are how TanStack Query identifies unique queries in the cache. We use a structured approach to query keys to ensure consistency and enable better cache management.

### Structure

We use two approaches for query keys in this project:

#### 1. Array-based Query Keys (Preferred)

For simple queries, use direct array-based query keys:

```typescript
// Preferred approach for simple queries
useQuery({
  queryKey: ['providers', 'recent', limit],
  queryFn: () => fetchRecentProviders(limit),
})
```

This approach ensures stable serialization and prevents cache misses caused by object key order variations.

#### 2. Helper Function Query Keys

For more complex scenarios, use the predefined query key factories in `lib/query/keys.ts`:

```typescript
export const queryKeys = {
  user: {
    all: ['user'] as const,
    details: () => [...queryKeys.user.all, 'details'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
  },
  // ...
};
```

When using query key factories, prefer passing primitive values (strings, numbers) instead of objects to ensure stable serialization:

```typescript
// Instead of this (might cause cache misses)
queryKeys.provider.list({ type: 'recent', limit })

// Use this pattern
queryKeys.provider.list('recent', limit)
// Or directly for simpler queries
['providers', 'recent', limit]
```

### Extending Query Keys

When adding new query keys, follow these patterns:

1. **For simple queries**, use direct array notation:

```typescript
// Simple queries (preferred)
['events', 'list', categoryId, page]
```

2. **For list queries with helper functions**, avoid objects in query keys and use primitive values:

```typescript
events: {
  all: ['events'] as const,
  // Instead of this
  // list: (filters?: EventFilters) => [...queryKeys.events.all, 'list', filters] as const,
  
  // Do this
  list: (category: string, page: number) => [...queryKeys.events.all, 'list', category, page] as const,
}
```

3. **For detail queries**, include the identifier in the query key:

```typescript
event: (id: number) => [...queryKeys.events.all, id] as const,
```

4. **For related resource queries**, include both resource identifiers:

```typescript
byProvider: (providerId: number) => [...queryKeys.events.all, 'provider', providerId] as const,
```

## Folder Structure

Organize your TanStack Query implementation as follows:

```
lib/
└── query/             # Core Query setup
    ├── client.ts      # QueryClient configuration
    ├── keys.ts        # Query key definitions
    └── provider.tsx   # Provider component

hooks/                 # Custom hooks directory
├── user/              # Domain-specific hooks
│   ├── use-user.ts
│   └── use-update-user.ts
├── providers/
│   ├── use-providers.ts
│   └── use-provider-details.ts
└── bookmarks/
    ├── use-bookmarks.ts
    └── use-toggle-bookmark.ts
```

## Custom Hook Patterns

Follow these patterns when creating custom hooks:

### Basic Query Hook

```typescript
// hooks/providers/use-provider-details.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProvider } from '@/lib/api/providers';
import type { Provider } from '@/types';

export function useProviderDetails(id: number) {
  return useQuery<Provider>({
    queryKey: queryKeys.provider.detail(id),
    queryFn: () => fetchProvider(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Conditional Query Hook

```typescript
// hooks/providers/use-provider-reviews.ts
export function useProviderReviews(providerId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews.byProvider(providerId as number),
    queryFn: () => fetchProviderReviews(providerId as number),
    enabled: !!providerId, // Only run if providerId is defined
  });
}
```

### Authenticated Query Hook

```typescript
// hooks/user/use-user-profile.ts
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchUserProfile } from '@/lib/api/user';

export function useUserProfile() {
  const { isSignedIn, userId } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.user.profile(userId as string),
    queryFn: async () => {
      const apiClient = await getApiClient(); // Use authenticated client
      return apiClient.get('/user/profile').then(res => res.data);
    },
    enabled: !!isSignedIn && !!userId,
  });
}
```

### Paginated Query Hook

```typescript
// hooks/providers/use-paginated-providers.ts
export function usePaginatedProviders(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.provider.list({ page, limit }),
    queryFn: () => fetchProviders({ page, limit }),
    keepPreviousData: true, // Keep previous page data while loading next page
  });
}
```

### Infinite Query Hook

```typescript
// hooks/providers/use-infinite-providers.ts
export function useInfiniteProviders(categoryId: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.provider.byCategory(categoryId),
    queryFn: ({ pageParam = 0 }) => 
      fetchProvidersByCategory(categoryId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
```

### Data Transformation Hook

When working with data that includes React components or other non-serializable values, use a two-step approach with useMemo:

```typescript
// hooks/categories/use-categories.ts
export function useCategories() {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: async () => {
      // Store serializable data in cache (string icons instead of React components)
      return categories.map(category => ({
        id: String(category.id),
        name: category.name,
        icon: category.icon, // Store as string for caching
        description: category.description
      }));
    },
  });
  
  // Transform the cached data with useMemo to create non-serializable values
  const processedData = useMemo(() => {
    if (!query.data) return undefined;
    
    return query.data.map(item => ({
      ...item,
      // Transform string values to React components
      icon: typeof item.icon === 'string' ? getIconByName(item.icon) : item.icon
    }));
  }, [query.data]);
  
  // Return the modified query object with transformed data
  return {
    ...query,
    data: processedData
  };
}
```

This pattern ensures:
1. Only serializable data is stored in the cache
2. React components and other non-serializable values are created at render time
3. The creation is optimized with useMemo to avoid unnecessary recalculations
4. The hook consumers get the fully processed data with proper types

### Expensive Derivation with useMemo

For components that perform expensive calculations based on query data, always use `useMemo` to prevent unnecessary recalculations on re-renders:

```typescript
// components/providers/categories-modal-tanstack.tsx
function CategoriesModalTanstack({ isOpen, onClose }) {
  const { data: categories, isLoading } = useCategories();
  const categoriesData = categories || [];
  
  // Memoize expensive data transformation operations
  const categoriesByGroup = useMemo(() => {
    if (isLoading || !categoriesData.length) return {};
    return categorizeByGroup(categoriesData);
  }, [isLoading, categoriesData]);
  
  // Component rendering...
}
```

```typescript
// components/providers/hybrid-categories-tanstack.tsx
function HybridCategoriesTanstack({ categories, className }) {
  // Memoize featured categories calculation
  const featuredCategories = useMemo(() => {
    // Logic to filter and select featured categories
    // ...
    return featured;
  }, [categories]);
  
  // Component rendering using featuredCategories...
}
```

When implementing such optimizations, make sure to:
1. Always include all dependencies that the calculation depends on
2. Keep the computation inside the `useMemo` as pure as possible
3. Use proper TypeScript interfaces instead of `any` to ensure type safety
4. Consider extracting complex logic into separate utility functions

## Error Handling Patterns

Follow these patterns when handling errors in your query and mutation functions:

### Fetch Error Handling

1. **Detailed Error Information**: Include status code and status text in error messages:

```typescript
if (!response.ok) {
  throw new Error(
    `Failed to fetch resource: ${response.status} ${response.statusText}`
  );
}
```

2. **JSON Parsing Error Handling**: Always handle potential JSON parsing errors:

```typescript
let data = [];
try {
  data = await response.json();
} catch (error) {
  console.warn('Failed to parse response:', error);
  return []; // Return empty data rather than crashing
}
```

3. **Content Type Enforcement**: Always request the correct content type:

```typescript
const response = await fetch(url, {
  headers: { Accept: 'application/json' },
  // other options...
});
```

### UI Error Display

1. **User-Friendly Error Messages**: Never show raw error messages to users:

```tsx
{isError && (
  <Alert variant="destructive">
    <AlertDescription>
      <span>Something went wrong. Please try again later.</span>
      {/* Log the actual error for debugging */}
      {process.env.NODE_ENV !== 'production' && console.error(error)}
      <Button onClick={() => refetch()} disabled={isFetching}>
        Try Again
      </Button>
    </AlertDescription>
  </Alert>
)}
```

2. **Error Boundary Integration**: Use React Error Boundaries for component-level error handling:

```tsx
<ErrorBoundary
  fallback={<ErrorFallback onRetry={() => queryClient.invalidateQueries(...)} />}
>
  <YourQueryComponent />
</ErrorBoundary>
```

3. **Retry Handling**: Implement retry buttons that show loading state and prevent multiple concurrent requests:

```tsx
<Button 
  onClick={() => refetch()} 
  disabled={isFetching}
  className="retry-button"
>
  {isFetching ? 'Retrying...' : 'Try Again'}
</Button>
```

### Basic Mutation

```typescript
// hooks/bookmarks/use-add-bookmark.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { addBookmark } from '@/lib/api/bookmarks';

export function useAddBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      // Invalidate the bookmarks list query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.list(),
      });
    },
  });
}
```

### Optimistic Update Mutation

```typescript
// hooks/bookmarks/use-toggle-bookmark.ts
export function useToggleBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleBookmark,
    onMutate: async (providerId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.bookmarks.list() 
      });
      
      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData(
        queryKeys.bookmarks.list()
      );
      
      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKeys.bookmarks.list(), 
        (old: number[]) => {
          if (old.includes(providerId)) {
            return old.filter(id => id !== providerId);
          } else {
            return [...old, providerId];
          }
        }
      );
      
      return { previousBookmarks };
    },
    onError: (err, providerId, context) => {
      // Roll back to the previous value if the mutation fails
      queryClient.setQueryData(
        queryKeys.bookmarks.list(), 
        context?.previousBookmarks
      );
    },
    onSettled: () => {
      // Invalidate related queries to ensure data consistency
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.bookmarks.list() 
      });
    },
  });
}
```

### Form Submission Mutation

```typescript
// hooks/reviews/use-submit-review.ts
export function useSubmitReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitReview,
    onSuccess: (data, variables) => {
      // Invalidate the provider's reviews query
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProvider(variables.providerId),
      });
      
      // Invalidate the user's reviews query
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byUser('me'),
      });
    },
  });
}
```

## SSR Patterns

Follow these patterns for server-side rendering with TanStack Query:

### Basic SSR with Data Prefetching

```tsx
// app/providers/[id]/page.tsx
import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ProviderDetail } from '@/components/provider-detail';

export default async function ProviderPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const providerId = parseInt(params.id);
  const queryClient = getQueryClient();
  
  // Prefetch the provider data
  await queryClient.prefetchQuery({
    queryKey: queryKeys.provider.detail(providerId),
    queryFn: () => fetchProvider(providerId),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProviderDetail id={providerId} />
    </HydrationBoundary>
  );
}
```

### Multiple Data Prefetching

```tsx
// app/providers/[id]/page.tsx
export default async function ProviderPage({ params }) {
  const providerId = parseInt(params.id);
  const queryClient = getQueryClient();
  
  // Prefetch multiple related queries
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.provider.detail(providerId),
      queryFn: () => fetchProvider(providerId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.reviews.byProvider(providerId),
      queryFn: () => fetchProviderReviews(providerId),
    }),
  ]);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProviderDetailPage id={providerId} />
    </HydrationBoundary>
  );
}
```

## Testing Patterns

Follow these patterns when testing TanStack Query implementations:

### Testing a Query Hook

```tsx
// hooks/use-providers.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/utils';
import { useProviders } from './use-providers';
import { fetchProviders } from '@/lib/api/providers';

// Mock the API function
jest.mock('@/lib/api/providers', () => ({
  fetchProviders: jest.fn(),
}));

describe('useProviders', () => {
  it('should fetch providers successfully', async () => {
    const providers = [{ id: 1, name: 'Provider 1' }];
    (fetchProviders as jest.Mock).mockResolvedValue(providers);
    
    const { result } = renderHook(() => useProviders(), {
      wrapper: createWrapper(),
    });
    
    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    // Check the data
    expect(result.current.data).toEqual(providers);
  });
  
  it('should handle errors', async () => {
    const error = new Error('Failed to fetch providers');
    (fetchProviders as jest.Mock).mockRejectedValue(error);
    
    const { result } = renderHook(() => useProviders(), {
      wrapper: createWrapper(),
    });
    
    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    // Check the error
    expect(result.current.error).toEqual(error);
  });
});
```

### Testing a Mutation Hook

```tsx
// hooks/use-add-bookmark.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/utils';
import { useAddBookmark } from './use-add-bookmark';
import { addBookmark } from '@/lib/api/bookmarks';

// Mock the API function
jest.mock('@/lib/api/bookmarks', () => ({
  addBookmark: jest.fn(),
}));

describe('useAddBookmark', () => {
  it('should add a bookmark successfully', async () => {
    (addBookmark as jest.Mock).mockResolvedValue({ id: 1 });
    
    const { result } = renderHook(() => useAddBookmark(), {
      wrapper: createWrapper(),
    });
    
    // Initial state
    expect(result.current.isIdle).toBe(true);
    
    // Trigger the mutation
    act(() => {
      result.current.mutate(1);
    });
    
    // Should be loading
    expect(result.current.isPending).toBe(true);
    
    // Wait for the mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    // Check the result
    expect(result.current.data).toEqual({ id: 1 });
    expect(addBookmark).toHaveBeenCalledWith(1);
  });
});
```

## Type-Safety Patterns

Follow these patterns to ensure type safety:

### Query Function Types

```typescript
// lib/api/providers.ts
import { API_BASE_URL } from '@/services/api';

export interface Provider {
  id: number;
  name: string;
  description: string;
}

export async function fetchProvider(id: number): Promise<Provider> {
  const response = await fetch(`${API_BASE_URL}/providers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch provider');
  }
  return response.json();
}
```

### Query Hook Types

```typescript
// hooks/providers/use-provider-details.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProvider, Provider } from '@/lib/api/providers';

export function useProviderDetails(
  id: number
): UseQueryResult<Provider, Error> {
  return useQuery<Provider, Error>({
    queryKey: queryKeys.provider.detail(id),
    queryFn: () => fetchProvider(id),
  });
}
```

### Mutation Hook Types

```typescript
// hooks/bookmarks/use-add-bookmark.ts
import { useMutation, UseMutationResult } from '@tanstack/react-query';

interface AddBookmarkResponse {
  id: number;
  providerId: number;
  createdAt: string;
}

export function useAddBookmark(): UseMutationResult<
  AddBookmarkResponse,
  Error,
  number
> {
  return useMutation<AddBookmarkResponse, Error, number>({
    mutationFn: addBookmark,
    // ...
  });
}
```

### TypeScript Utility Types

```typescript
// types/query.ts
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

// Type for query options with default error type
export type QueryOptions<TData, TError = Error> = UseQueryOptions<
  TData,
  TError
>;

// Type for query result with default error type
export type QueryResult<TData, TError = Error> = UseQueryResult<
  TData,
  TError
>;
```

## Conclusion

By following these patterns, you'll ensure consistency across the codebase and make it easier for the team to maintain and extend the application. These patterns leverage the full power of TanStack Query while ensuring type safety and testability.

Remember, these patterns are guidelines, not strict rules. Adapt them as needed for your specific use cases, but try to maintain consistency with the rest of the codebase.
