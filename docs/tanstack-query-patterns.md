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

Always use the predefined query key factories in `lib/query/keys.ts`:

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

### Extending Query Keys

When adding new query keys, follow these patterns:

1. **List queries**: Use plural nouns for the key group and include optional params for filtering:

```typescript
events: {
  all: ['events'] as const,
  list: (filters?: EventFilters) => [...queryKeys.events.all, 'list', filters] as const,
}
```

2. **Detail queries**: Include the identifier in the query key:

```typescript
event: (id: number) => [...queryKeys.events.all, id] as const,
```

3. **Related resource queries**: Include both resource identifiers:

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

## Mutation Patterns

Follow these patterns when implementing mutations:

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
