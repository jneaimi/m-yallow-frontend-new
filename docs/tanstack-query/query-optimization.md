# Query Optimization

This document outlines best practices for optimizing queries when using TanStack Query in the M-Yallow Frontend project.

## 1. Proper Query Key Typing and Structure

**Issue**: Using unsafe type assertions like `as any` in query keys can lead to type errors and make it harder to track dependencies between queries.

**Solution**:
- Create dedicated query key helper functions for each distinct query type
- Use proper TypeScript typing for all parameters
- Implement conditionally selected query keys based on available data

```typescript
// In queryKeys.ts
export const queryKeys = {
  reviews: {
    all: ['reviews'] as const,
    byProvider: (providerId: number, limit?: number) => 
      [...queryKeys.reviews.all, 'byProvider', providerId, limit] as const,
    byCurrentProvider: (limit?: number) => 
      [...queryKeys.reviews.all, 'byProvider', 'current', limit] as const,
  },
  
  provider: {
    // ...existing keys
    metrics: () => [...queryKeys.provider.all, 'metrics'] as const,
    metricsById: (providerId: number) => 
      [...queryKeys.provider.all, 'metrics', providerId] as const,
  }
}

// In the hook implementation
export function useProviderMetrics() {
  const { data: providerData } = useProviderMe();
  
  return useQuery({
    // Conditional query key selection based on available data
    queryKey: providerData?.id 
      ? queryKeys.provider.metricsById(providerData.id)
      : queryKeys.provider.metrics(),
    // Rest of the implementation...
  });
}
```

Benefits of this approach:
- Type safety without using `any` type assertions
- Clear query cache separation for different query variations
- Easier query invalidation with properly structured keys
- Better tracking of query dependencies

## 2. Stable Query Keys for Arrays

**Issue**: Unnecessary refetches when passing arrays or objects directly in query keys due to identity comparison.

**Solution**:
- Sort arrays or use stable serialization for array query keys
- Use constants and helper functions for query keys
- Expose static methods on hooks to access query keys
- This prevents unnecessary network requests and UI flickering

```typescript
// Bad - array identity changes on each render, causing unnecessary refetches
queryKey: ['bookmarkedProviders', bookmarkIds],

// Good - array contents are sorted for stable identity
queryKey: ['bookmarkedProviders', [...bookmarkIds].sort()],

// Alternative - use an object if order matters
queryKey: ['bookmarkedProviders', { ids: bookmarkIds }],

// Best - use a static accessor method for external invalidation
useBookmarkedProviders.getKey = () => ['bookmarkedProviders'];
queryClient.invalidateQueries({ queryKey: useBookmarkedProviders.getKey() });
```

## 3. Shared Query Functions with Transformation

**Issue**: Inconsistent data transformation across components and hooks using the same query key.

**Solution**:
- Export dedicated query functions from your API modules that handle both fetching and transformation
- Import and use these query functions directly in both server and client components
- This ensures that all components working with the same data receive identical structures

```typescript
// In your lib/api/categories.ts file:
export async function categoriesQueryFn() {
  const data = await fetchPublicCategories();
  return transformCategories(data.categories);
}

// In your server component:
await queryClient.prefetchQuery({
  queryKey: queryKeys.categories.public(),
  queryFn: categoriesQueryFn,
});

// In your client hook:
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: categoriesQueryFn,
    // Other options...
  });
}
```

By sharing the query function, you avoid duplicating transformation logic and ensure that server-side prefetching produces exactly the same data structure that client components expect.
