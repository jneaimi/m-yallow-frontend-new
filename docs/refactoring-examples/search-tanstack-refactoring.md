# Search TanStack Query Refactoring

This document details the process of refactoring the search functionality in the M-Yallow Frontend to use TanStack Query. It covers the implementation approach, key considerations, and lessons learned.

## Table of Contents

1. [Original Implementation](#original-implementation)
2. [Refactoring Goals](#refactoring-goals)
3. [Implementation Details](#implementation-details)
4. [Challenges and Solutions](#challenges-and-solutions)
5. [Performance Improvements](#performance-improvements)

## Original Implementation

The original search implementation was a server component that:

- Fetched data directly using the `searchProviders` function
- Handled various edge cases for API responses
- Managed UI states (loading, error, empty results)
- Included fallback data for error scenarios

The implementation was functional but had several limitations:

- Tightly coupled data fetching and presentation logic
- No client-side caching for repeated searches
- Fetching logic duplicated with other provider listing components
- Complex error handling embedded directly in the component

## Refactoring Goals

The main goals of the refactoring were to:

1. Separate data fetching from presentation
2. Implement proper client-side caching with TanStack Query
3. Create reusable hooks and components
4. Improve error handling and loading states
5. Maintain the same user experience and functionality

## Implementation Details

### 1. API Function

We extracted the search logic to a dedicated API file (`lib/api/providers/search.ts`):

```typescript
export interface SearchParams {
  query?: string;
  categoryId?: string;
  limit?: number;
}

export interface SearchResponse {
  providers: Provider[];
  total: number;
}

export async function searchProviders({
  query = "",
  categoryId,
  limit = 20
}: SearchParams = {}): Promise<SearchResponse> {
  // Implementation details...
}
```

The API function handles:
- Parameter validation and formatting
- Endpoint selection based on parameters
- Response parsing and normalization
- Error handling with fallback data

### 2. Query Key Structure

We enhanced the query key structure to support search parameters:

```typescript
// lib/query/keys.ts
provider: {
  // Other keys...
  search: ({ query, categoryId, limit }: { query?: string; categoryId?: string; limit?: number }) => 
    [...queryKeys.provider.all, 'search', query || '', categoryId || '', limit || 20] as const,
}
```

This structure ensures that:
- Each unique search has its own cache entry
- Cache invalidation can target specific searches
- Empty parameters still result in stable cache keys

### 3. Custom Hook

We created a dedicated hook for search functionality:

```typescript
// hooks/providers/use-search-providers.ts
export function useSearchProviders({
  query = "",
  categoryId,
  limit = 20
}: SearchParams = {}) {
  return useQuery<SearchResponse>({
    queryKey: queryKeys.provider.search({ query, categoryId, limit }),
    queryFn: () => searchProviders({ query, categoryId, limit }),
    staleTime: 60 * 1000,
    retry: 1,
  });
}
```

The hook provides:
- Automatic caching with a 1-minute stale time
- Limited retry for failed requests
- Type-safe parameters and return values

### 4. Client Component

We implemented a dedicated client component for search results:

```typescript
// components/providers/search-results.tsx
export function SearchResults({ 
  initialQuery = "", 
  initialCategoryId,
  limit = 20
}: SearchResultsProps) {
  const { data, isLoading, isError, error } = useSearchProviders({
    query: initialQuery,
    categoryId: initialCategoryId,
    limit
  });
  
  // Handling loading, error, and rendering...
}
```

The component focuses solely on:
- Rendering the search results
- Handling loading and error states
- Presenting empty result messages

### 5. Page Component

We refactored the main search page to use server-side prefetching:

```typescript
// app/providers/search/page.tsx
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Parse parameters
  const params = await searchParams;
  const query = params.q || "";
  const categoryId = params.category;
  
  // Initialize QueryClient and prefetch data
  const queryClient = getQueryClient();
  
  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.provider.search({ query, categoryId, limit: 20 }),
      queryFn: () => searchProviders({ query, categoryId, limit: 20 }),
    });
  } catch (error) {
    console.error("Error prefetching search data:", error);
  }
  
  return (
    // Page structure with HydrationBoundary
  );
}
```

This approach provides:
- Server-side prefetching for optimal initial load
- Client-side state management for subsequent searches
- Graceful error handling at each level

## Challenges and Solutions

### 1. API Response Format Variability

**Challenge**: The search API returned data in different formats depending on the endpoint used.

**Solution**: We implemented robust response parsing in the API function:

```typescript
// Handle different response formats
let providers: ApiProvider[];

if (Array.isArray(data)) {
  providers = data;
} else if (data.providers && Array.isArray(data.providers)) {
  providers = data.providers;
} else if (data.results && Array.isArray(data.results)) {
  providers = data.results;
} else {
  // Last resort fallback - look for any array in the response
  const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
  if (possibleArrays.length > 0 && possibleArrays[0].length > 0) {
    providers = possibleArrays[0] as ApiProvider[];
  } else {
    throw new Error("Unexpected API response format");
  }
}
```

This approach ensures that regardless of the response format, we can extract and process the provider data consistently.

### 2. Category Filtering Edge Cases

**Challenge**: Category filtering sometimes needed to be applied client-side when the API didn't properly filter results.

**Solution**: We implemented client-side filtering as a fallback:

```typescript
// Client-side category filtering if needed
if (categoryId) {
  const filteredProviders = transformedProviders.filter(provider => 
    provider.categories?.some(cat => String(cat.id) === categoryId)
  );
  
  if (filteredProviders.length > 0) {
    return {
      providers: filteredProviders,
      total: filteredProviders.length
    };
  }
}
```

This ensures that even if the API returns unfiltered results, we still provide correctly filtered data to the client.

### 3. Error Handling Strategy

**Challenge**: Determining when to use fallback data versus showing error messages.

**Solution**: We implemented a multi-layered approach:

1. **API Function**: Catches errors and returns mock data for critical failures
2. **Query Hook**: Limited retry (once) to avoid excessive API calls
3. **Client Component**: Shows user-friendly error messages
4. **Page Component**: Graceful error handling during prefetching

This provides a balanced approach where users will still see results for transient failures but get proper error messages for persistent issues.

## Performance Improvements

The refactored search implementation offers several performance benefits:

1. **Automatic Caching**: Repeated searches for the same query are served from cache, reducing API calls
2. **Stale-While-Revalidate**: Users see cached results immediately while fresh data is fetched in the background
3. **Optimized Rendering**: TanStack Query only triggers re-renders when necessary
4. **Server-Side Prefetching**: Initial searches benefit from server-rendered data
5. **Balanced Error Handling**: Limited retries prevent excessive API calls for failing endpoints

## Integration with Existing Components

The search functionality integrates with:

- **SearchBar Component**: Handles user input and navigation to search page
- **ProviderCard Component**: Displays individual search results
- **ResponsiveGrid Component**: Arranges search results in a responsive layout

This integration ensures a consistent user experience across the application.

## Future Improvements

Potential future enhancements include:

1. **Search Suggestions**: Implementing auto-complete based on popular searches
2. **Advanced Filtering**: Adding more filters (location, rating, etc.)
3. **Search History**: Tracking and displaying recent searches
4. **Infinite Scrolling**: Replacing pagination with infinite scrolling
5. **Analytics Integration**: Tracking search patterns for feature improvements

## Conclusion

The refactoring of the search functionality to use TanStack Query has significantly improved the code structure, performance, and maintainability. By separating concerns and implementing proper caching, we've created a more robust and scalable solution while maintaining the same user experience.

The modular approach also provides a template for refactoring other features, making it easier to maintain consistency across the codebase.
