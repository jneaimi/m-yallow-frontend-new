# Component Design Best Practices

This document outlines best practices for component design when using TanStack Query in the M-Yallow Frontend project.

## 1. Server-Side Prefetching Alignment

**Issue**: Hydration errors or missing data when prefetched server data doesn't match client-side query expectations.

**Solution**:
- Ensure server-side prefetching uses the exact same transformation as client-side queries
- Use the same `queryFn` structure in both server and client components
- Be cautious when accessing prefetched data on the server, as its structure must match the client expectation

```typescript
// Server-side prefetching in page.tsx
await queryClient.prefetchQuery({
  queryKey: queryKeys.categories.public(),
  queryFn: async () => {
    const data = await fetchPublicCategories();
    // Must match the transformation in client hooks
    return data.categories.map(category => ({
      id: String(category.id),
      name: category.name,
      icon: category.icon
    }));
  }
});

// When accessing the data on the server
const categories = queryClient.getQueryData(queryKeys.categories.public());
// Now we know categories is an array of category objects
```

## 2. Flexible Component Props for Different Data Structures

**Issue**: Components may receive differently structured data when used in different contexts, leading to type errors or runtime exceptions.

**Solution**:
- Design components to handle multiple possible data structures
- Use type checking to adapt rendering based on the actual data received
- Update prop types to accurately reflect the component's capabilities

```typescript
// Type definition that supports multiple data structures
categories?: Array<string | { id?: number; name: string }>;

// Component logic that adapts to the data structure
{categories?.slice(0, 3).map((category, index) => (
  <Badge 
    key={typeof category === 'object' ? category.id || index : index} 
    variant="outline" 
    className="text-xs"
  >
    {typeof category === 'object' ? category.name : category}
  </Badge>
))}
```

This approach ensures:
- The component can work with both object-based categories (from API) and string-based categories (from transformations)
- Key prop issues are avoided by using appropriate fallbacks
- The component is more reusable across different parts of the application
- Type safety is maintained through proper interface definitions

## 3. Optimizing Query Execution with the `enabled` Option

**Issue**: Unnecessary API calls when parameters are undefined or empty, especially during initial renders.

**Solution**:
- Use the `enabled` option to conditionally run queries only when all required parameters are available.
- This prevents unnecessary network requests, error states, and UI flickers.
- Particularly useful with route parameters that may be undefined during initial renders.

```typescript
// Without optimization - will trigger API calls even with invalid/missing categoryId
export function useProvidersByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.provider.byCategory(categoryId),
    queryFn: () => fetchProvidersByCategory(categoryId),
    staleTime: 60 * 1000
  });
}

// With optimization - only runs when categoryId is truthy
export function useProvidersByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.provider.byCategory(categoryId),
    queryFn: () => fetchProvidersByCategory(categoryId),
    staleTime: 60 * 1000,
    enabled: Boolean(categoryId) // Only run when we have a valid categoryId
  });
}
```

## 4. Dependent Queries with Provider Data

**Issue**: When fetching data related to the current provider, using the `/providers/me/...` endpoints can cause validation errors if the backend expects numeric provider IDs.

**Solution**:
- Use dependent queries pattern where provider data is fetched first, then used in subsequent queries
- Create specific query key helpers for queries that depend on provider ID
- Conditionally enable queries based on the availability of the provider ID

```typescript
// Define specific query key helpers in queryKeys.ts
reviews: {
  all: ['reviews'] as const,
  byProvider: (providerId: number) => [...queryKeys.reviews.all, 'byProvider', providerId] as const,
  byCurrentProvider: (limit: number) => [...queryKeys.reviews.all, 'byProvider', 'current', limit] as const,
},

// In the hook implementation
export function useProviderReviews(limit: number = 5) {
  const { data: providerData, isLoading: isProviderLoading } = useProviderMe();

  return useQuery<Review[]>({
    // Use different query keys based on whether the provider ID is available
    queryKey: providerData?.id 
      ? queryKeys.reviews.byProvider(providerData.id, limit)
      : queryKeys.reviews.byCurrentProvider(limit),
    queryFn: async () => {
      if (!providerData || !providerData.id) {
        throw new Error('Provider profile not found');
      }
      
      // Use the numeric ID in the API request
      const apiClient = await getApiClient();
      const response = await apiClient.get(`/providers/${providerData.id}/reviews?limit=${limit}`);
      
      // Rest of the implementation...
    },
    // Only enable the query when we have the provider data
    enabled: !!isSignedIn && !isProviderLoading && !!providerData?.id,
  });
}
```

This approach ensures:
- Type safety by avoiding unsafe type assertions like `as any`
- Proper sequencing of API calls, waiting for provider data before making dependent calls
- Clear query cache separation between different providers
- Better error handling with specific error messages

## 5. Environment-Aware Fetch Options

**Issue**: Using Next.js-specific options in browser environments or vice versa.

**Solution**:
- Detect the environment before applying platform-specific options.
- For Next.js, use the `next: { revalidate }` option only on the server.
- This improves bundle size through better tree-shaking and avoids potential type issues.

```typescript
// Check if code is running on the server
const isServer = typeof window === 'undefined';

// Apply Next.js cache options only on the server
const res = await fetch(
  endpoint,
  isServer ? 
    ({ next: { revalidate: 60 } } as RequestInit & { next: { revalidate: number } }) : 
    undefined
);
```
