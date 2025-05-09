# TanStack Query Reference Guide

This document serves as a comprehensive reference for using TanStack Query in the M-Yallow Frontend project. It covers the initial setup and configuration that has been implemented and provides guidelines for future implementations.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Core Concepts](#core-concepts)
4. [Basic Usage](#basic-usage)
5. [Advanced Patterns](#advanced-patterns)
6. [SSR Integration](#ssr-integration)
7. [Common Use Cases](#common-use-cases)
8. [Troubleshooting](#troubleshooting)
9. [Migration Tips](#migration-tips)

## Overview

TanStack Query (formerly React Query) is a powerful data fetching and caching library that simplifies state management for asynchronous data in React applications. The library provides hooks for fetching, caching, synchronizing, and updating server state in React applications.

Our implementation includes:

- A centralized QueryClient configuration with optimized defaults
- Custom hooks for common data fetching operations
- Integration with Next.js App Router for SSR
- Type-safe query key management
- Consistent patterns for data fetching and mutations

## Directory Structure

```
lib/
└── query/
    ├── client.ts          # QueryClient configuration
    ├── index.ts           # Main exports
    ├── keys.ts            # Query key management
    ├── provider.tsx       # QueryClientProvider component
    └── README.md          # Local documentation
```

## Core Concepts

### QueryClient

The `QueryClient` is the core class responsible for managing the cache, pending queries, and query states. Our project uses a singleton pattern for client-side rendering to ensure consistent query caching across components.

```typescript
// lib/query/client.ts
import { QueryClient } from '@tanstack/react-query';

// Default settings for all queries
const defaultQueryOptions = {
  queries: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
    retry: 1,
  },
  // ...
};

// Singleton pattern for client-side
let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return new QueryClient({ defaultOptions: defaultQueryOptions });
  }
  
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: defaultQueryOptions,
    });
  }
  
  return browserQueryClient;
};
```

### ReactQueryProvider

The `ReactQueryProvider` component wraps your application and provides the query client to all child components. It also includes the ReactQueryDevtools in development mode.

```tsx
// lib/query/provider.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { getQueryClient } from './client';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Query Keys

Query keys are used by TanStack Query to identify and manage cache entries. We use a structured approach to query key management to ensure consistency and enable easier cache invalidation.

```typescript
// lib/query/keys.ts
export const queryKeys = {
  user: {
    all: ['user'] as const,
    details: () => [...queryKeys.user.all, 'details'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
  },
  provider: {
    all: ['provider'] as const,
    list: (params?: Record<string, any>) => [...queryKeys.provider.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.provider.all, 'detail', id] as const,
  },
  // ...
};
```

## Basic Usage

### Fetching Data

Here's how to create a custom hook for fetching data:

```typescript
// hooks/use-provider.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProvider } from '@/lib/api';

export function useProvider(id: number) {
  return useQuery({
    queryKey: queryKeys.provider.detail(id),
    queryFn: () => fetchProvider(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

Then use it in your component:

```tsx
// components/provider-detail.tsx
'use client';

import { useProvider } from '@/hooks/use-provider';

export function ProviderDetail({ id }: { id: number }) {
  const { data, isLoading, error } = useProvider(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Provider not found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  );
}
```

### Creating and Using Mutations

For data updates, use the `useMutation` hook:

```typescript
// hooks/use-update-provider.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { updateProvider } from '@/lib/api';

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProvider,
    onSuccess: (data, variables) => {
      // Invalidate the specific provider detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.detail(variables.id),
      });
    },
  });
}
```

And use it in your component:

```tsx
// components/edit-provider-form.tsx
'use client';

import { useUpdateProvider } from '@/hooks/use-update-provider';

export function EditProviderForm({ provider }) {
  const updateMutation = useUpdateProvider();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    updateMutation.mutate({
      id: provider.id,
      ...data,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? 'Saving...' : 'Save'}
      </button>
      
      {updateMutation.isError && (
        <div>Error: {updateMutation.error.message}</div>
      )}
      
      {updateMutation.isSuccess && (
        <div>Provider updated successfully!</div>
      )}
    </form>
  );
}
```

## Advanced Patterns

### Optimistic Updates

Optimistic updates provide a better user experience by updating the UI immediately before the server confirms the change:

```typescript
// hooks/use-toggle-bookmark.ts
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

### Dependent Queries

When a query depends on data from another query:

```typescript
// hooks/use-provider-reviews.ts
export function useProviderReviews(providerId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews.byProvider(providerId as number),
    queryFn: () => fetchProviderReviews(providerId as number),
    // Only run this query if providerId is defined
    enabled: !!providerId,
  });
}
```

### Infinite Queries

For infinite scrolling or "load more" functionality:

```typescript
// hooks/use-infinite-providers.ts
export function useInfiniteProviders(categoryId: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.provider.byCategory(categoryId),
    queryFn: ({ pageParam = 0 }) => 
      fetchProvidersByCategory(categoryId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
```

And use it in your component:

```tsx
// components/infinite-provider-list.tsx
'use client';

import { useInfiniteProviders } from '@/hooks/use-infinite-providers';

export function InfiniteProviderList({ categoryId }: { categoryId: number }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProviders(categoryId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </React.Fragment>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
    </div>
  );
}
```

## SSR Integration

### Prefetching Data on the Server

For Server Components in Next.js App Router:

```tsx
// app/providers/[id]/page.tsx
import { getQueryClient } from '@/lib/query';
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

## Common Use Cases

### Authentication Integration

When working with authenticated endpoints:

```typescript
// hooks/use-user-profile.ts
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchUserProfile } from '@/lib/api';

export function useUserProfile() {
  const { isSignedIn, userId } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.user.profile(userId as string),
    queryFn: () => fetchUserProfile(),
    // Only run this query if the user is signed in
    enabled: !!isSignedIn && !!userId,
  });
}
```

### Search Implementation

For search functionality with debouncing:

```typescript
// hooks/use-search-providers.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { searchProviders } from '@/lib/api';
import { useState, useEffect } from 'react';

export function useSearchProviders(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  
  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [query]);
  
  const searchQuery = useQuery({
    queryKey: queryKeys.provider.search(debouncedQuery),
    queryFn: () => searchProviders(debouncedQuery),
    // Don't run the query if the search query is empty
    enabled: debouncedQuery.length > 0,
    // Keep the previous results while fetching new ones
    keepPreviousData: true,
  });
  
  return {
    ...searchQuery,
    query,
    setQuery,
  };
}
```

## Troubleshooting

### Common Issues

1. **Stale data not updating**: Check your `staleTime` settings. If set too high, data won't be automatically refetched.

2. **Missing data after navigation**: Ensure you're using proper query keys and prefetching data for important routes.

3. **Infinite loop of refetches**: Check your `queryFn` implementation. It might be causing side effects that trigger renders.

4. **SSR hydration errors**: Make sure your server and client query key structures match exactly.

### Using DevTools

Enable the React Query DevTools to debug query behavior:

```tsx
<ReactQueryDevtools initialIsOpen={false} />
```

The DevTools provide valuable insights into:
- Active queries and their states
- Query cache contents
- Query refetch timing
- Background refetching status

## Migration Tips

When migrating existing features to TanStack Query:

1. **Start with independent features** that don't depend on many other parts of the app.

2. **Identify data dependencies** before refactoring to understand which queries depend on others.

3. **Keep existing implementations running in parallel** until you've fully tested the new implementation.

4. **Refactor in incremental steps**:
   - First, create the query hooks
   - Then, implement the UI components using these hooks
   - Finally, test thoroughly before removing the old implementation

5. **Update tests** to account for the new loading, error, and success states.

---

By following these guidelines and patterns, you can effectively leverage TanStack Query to manage server state in your React application, resulting in a more maintainable and performant codebase.
