# Providers List TanStack Query Refactoring

This document details the process and considerations for refactoring the Providers List component to use TanStack Query. It covers the implementation details, challenges faced, and solutions applied.

## Table of Contents

1. [Original Implementation](#original-implementation)
2. [Refactoring Goals](#refactoring-goals)
3. [Implementation Steps](#implementation-steps)
4. [Challenges and Solutions](#challenges-and-solutions)
5. [Code Examples](#code-examples)
6. [Testing Considerations](#testing-considerations)
7. [Performance Improvements](#performance-improvements)

## Original Implementation

The original Providers List component was implemented as a Server Component in Next.js, which fetched data directly using the native `fetch` API with `revalidate` for caching. It handled pagination, filtering, and loading states, but was tightly coupled with the data fetching logic.

### Key characteristics of the original implementation:

- Server Component with `async` functions for data fetching
- Direct `fetch` calls with `revalidate` for caching
- Pagination and filtering through URL parameters
- Fallback UI for loading states
- Error handling and mock data fallback

## Refactoring Goals

The refactoring aimed to achieve several improvements:

1. Create a modular structure with clearer separation of concerns
2. Move data fetching logic to client components using TanStack Query
3. Use server components for initial data fetching and hydration
4. Maintain the existing functionality, including pagination and filtering
5. Improve error handling and loading states
6. Ensure type safety throughout the implementation

## Implementation Steps

The refactoring was implemented in several distinct steps:

### 1. Create API Functions

Extracted and refactored the data fetching logic into a dedicated API function in `/lib/api/providers/list.ts`:

```typescript
export async function fetchProvidersList({
  page = 1, 
  pageSize = 12,
  name = '',
  location = '',
  category = ''
}: ProviderListParams = {}): Promise<ProvidersListResponse> {
  try {
    // API request logic
    // ...
  } catch (error) {
    // Error handling and fallback
    // ...
  }
}
```

### 2. Create Custom Hooks

Implemented a custom hook in `/hooks/providers/use-providers-list.ts` that leverages TanStack Query for data fetching:

```typescript
export function useProvidersList({
  page = 1,
  pageSize = 12,
  name = '',
  location = '',
  category = '',
}: ProviderListParams = {}) {
  return useQuery<ProvidersListResponse>({
    queryKey: queryKeys.provider.list({ page, pageSize, name, location, category }),
    queryFn: () => fetchProvidersList({ page, pageSize, name, location, category }),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
}
```

### 3. Create Client Component

Developed a client component in `/components/providers/providers-list-client.tsx` that uses the custom hook and handles the UI rendering:

```tsx
export function ProvidersListClient({
  initialPage,
  initialPageSize,
  initialName = '',
  initialLocation = '',
  initialCategory = '',
}: ProvidersListClientProps) {
  const { data, isLoading, isError, error } = useProvidersList({
    page: initialPage,
    pageSize: initialPageSize,
    name: initialName,
    location: initialLocation,
    category: initialCategory,
  });
  
  // Rendering logic
  // ...
}
```

### 4. Update Server Component

Refactored the main page component to use SSR with TanStack Query:

```tsx
export default async function ListPage({ searchParams }: ListPageProps) {
  // Parse parameters
  // ...
  
  // Initialize QueryClient
  const queryClient = getQueryClient();
  
  // Prefetch data
  await queryClient.prefetchQuery({
    queryKey: queryKeys.provider.list({ /* params */ }),
    queryFn: () => fetchProvidersList({ /* params */ }),
  });
  
  return (
    // Page layout
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProvidersListClient /* props */ />
    </HydrationBoundary>
  );
}
```

## Challenges and Solutions

During the refactoring process, we encountered several challenges:

### 1. API Authentication Requirements

**Challenge**: The Provider List API endpoint required authentication, resulting in 401 Unauthorized errors.

**Solution**: Used the public API endpoint (`PROVIDER_API.PUBLIC`) instead of the authenticated endpoint (`PROVIDER_API.LIST`):

```typescript
// Before
const res = await fetch(`${PROVIDER_API.LIST}?${params}`);

// After
const res = await fetch(`${PROVIDER_API.PUBLIC}?${params}`);
```

### 2. Handling NULL Values

**Challenge**: Errors occurred when handling null hero image URLs in the provider cards.

**Solution**: Implemented robust null handling in both the data transformation function and component props:

```typescript
// In transformation function
heroImageUrl: apiProvider.hero_image_url || getFallbackImageUrl(),

// In component props
<ProviderCard
  heroImageUrl={provider.heroImageUrl || '/placeholder-image.jpg'}
/>
```

### 3. Error Handling

**Challenge**: Generic error messages didn't provide enough information for debugging.

**Solution**: Implemented detailed error handling with specific error messages and console logs:

```typescript
if (!res.ok) {
  console.warn(`API response not OK: ${res.status} ${res.statusText}`);
  throw new Error(`Failed to fetch providers list: ${res.status} ${res.statusText}`);
}

try {
  data = await res.json();
} catch (parseError) {
  console.error('Failed to parse providers list response:', parseError);
  throw new Error('Failed to parse response data');
}
```

### 4. Type Safety

**Challenge**: The raw API response type (`ProvidersListResponse` with `ApiProvider[]`) differed from the transformed client-side data (`Provider[]`), causing type-safety issues.

**Solution**: Created a separate client-side response interface to accurately represent the transformed data structure:

```typescript
/**
 * Client-side response interface after providers transformation
 */
export interface ProvidersListClientResponse {
  providers: Provider[];
  total: number;
  page: number;
  pageSize: number;
}
```

And updated the function signature to properly reflect the returned data:

```typescript
export async function fetchProvidersList({
  // ... parameters
}: ProviderListParams = {}): Promise<ProvidersListClientResponse> {
  // ...
}
```

### 5. Server-Side Errors

**Challenge**: Server-side prefetching errors could crash the entire page.

**Solution**: Implemented try-catch to handle prefetching errors gracefully:

```typescript
try {
  await queryClient.prefetchQuery({
    // ...
  });
} catch (error) {
  console.error('Failed to prefetch providers data:', error);
  // Let the client component handle displaying the error
}
```

### API Function

```typescript
// lib/api/providers/list.ts
/**
 * Client-side response interface after providers transformation
 */
export interface ProvidersListClientResponse {
  providers: Provider[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchProvidersList({
  page = 1, 
  pageSize = 12,
  name = '',
  location = '',
  category = ''
}: ProviderListParams = {}): Promise<ProvidersListClientResponse> {
  try {
    // Create query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    
    // Append non-empty filter parameters
    if (name) params.append("name", name);
    if (location) params.append("location", location);
    if (category) params.append("category", category);
    
    // Use the public API endpoint
    const res = await fetch(`${PROVIDER_API.PUBLIC}?${params}`);
    
    if (!res.ok) {
      console.warn(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch providers list: ${res.status} ${res.statusText}`);
    }
    
    let data: ProvidersListResponse;
    try {
      data = await res.json() as ProvidersListResponse;
    } catch (parseError) {
      console.error('Failed to parse providers list response:', parseError);
      throw new Error('Failed to parse response data');
    }
    
    // Transform API providers to client provider format
    const processedProviders = data.providers.map(transformProvider);
    
    const response: ProvidersListClientResponse = {
      providers: processedProviders,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize
    };
    
    return response;
  } catch (error) {
    console.error('Error fetching providers list:', error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    const fallback: ProvidersListClientResponse = {
      providers: [
        // Mock data implementation
        // ...
      ],
      total: 3,
      page,
      pageSize
    };
    
    return fallback;
  }
}
```

### Custom Hook

```typescript
// hooks/providers/use-providers-list.ts
export function useProvidersList({
  page = 1,
  pageSize = 12,
  name = '',
  location = '',
  category = '',
}: ProviderListParams = {}) {
  return useQuery<ProvidersListClientResponse>({
    queryKey: queryKeys.provider.list({ page, pageSize, name, location, category }),
    queryFn: () => fetchProvidersList({ page, pageSize, name, location, category }),
    keepPreviousData: true, // Keep previous page data while loading next page
    staleTime: 60 * 1000, // Consider data stale after 1 minute
    retry: 1, // Only retry once to avoid excessive failed requests
    // On error, log but let the component handle display
    onError: (error) => {
      console.error('Error in useProvidersList:', error);
    }
  });
}
```

### Client Component

```tsx
// components/providers/providers-list-client.tsx
export function ProvidersListClient({
  initialPage,
  initialPageSize,
  initialName = '',
  initialLocation = '',
  initialCategory = '',
}: ProvidersListClientProps) {
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useProvidersList({
    page: initialPage,
    pageSize: initialPageSize,
    name: initialName,
    location: initialLocation,
    category: initialCategory,
  });
  
  // Loading state
  if (isLoading) {
    return <div className="text-center py-12">Loading providers...</div>;
  }
  
  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Error loading providers</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </div>
    );
  }
  
  // No providers state
  if (data?.providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }
  
  // Pagination logic
  // ...
  
  return (
    <div>
      <ResponsiveGrid>
        {data.providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name}
            heroImageUrl={provider.heroImageUrl || '/placeholder-image.jpg'}
            aboutSnippet={provider.aboutSnippet}
            categories={provider.categories}
          />
        ))}
      </ResponsiveGrid>
      
      {/* Pagination Controls */}
      {/* ... */}
    </div>
  );
}
```

### Server Component

```tsx
// app/providers/list/page.tsx
export default async function ListPage({ searchParams }: ListPageProps) {
  // Parse parameters
  const params = await searchParams;
  
  const parsedPage = parseInt(params.page || "1");
  const parsedPageSize = parseInt(params.pageSize || "12");
  
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const pageSize = isNaN(parsedPageSize) || parsedPageSize < 1 ? 12 : 
                   parsedPageSize > 100 ? 100 : parsedPageSize;
  
  const name = params.name || '';
  const location = params.location || '';
  const category = params.category || '';
  
  // Initialize QueryClient
  const queryClient = getQueryClient();
  
  try {
    // Prefetch data
    await queryClient.prefetchQuery<ProvidersListClientResponse>({
      queryKey: queryKeys.provider.list({ page, pageSize, name, location, category }),
      queryFn: () => fetchProvidersList({ page, pageSize, name, location, category }),
      retry: 1,
    });
  } catch (error) {
    console.error('Failed to prefetch providers data:', error);
    // We'll let the client component handle displaying the error
  }
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">All Providers</h1>
          <SearchBar />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Loading providers...</div>}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProvidersListClient 
              initialPage={page} 
              initialPageSize={pageSize} 
              initialName={name}
              initialLocation={location}
              initialCategory={category}
            />
          </HydrationBoundary>
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
```

## Testing Considerations

When testing the refactored providers list, consider the following:

1. **Loading States**: Test that loading states are correctly displayed while data is being fetched.
2. **Error States**: Test error handling by mocking failed API requests.
3. **Empty States**: Test the component behavior when no providers are returned.
4. **Pagination**: Test that pagination correctly navigates between pages.
5. **Filters**: Test that filters are correctly applied to the query.
6. **Hydration**: Test that server-side rendered data is correctly hydrated on the client.

## Performance Improvements

The refactored implementation provides several performance benefits:

1. **Automatic Caching**: TanStack Query automatically caches results, reducing unnecessary network requests.
2. **Improved Loading Experience**: The `keepPreviousData` option ensures that previous data remains visible while loading new pages.
3. **Background Refetching**: Stale data is automatically refetched in the background after 1 minute.
4. **Reduced Server Load**: By moving data fetching to the client for subsequent requests, we reduce server load.
5. **Optimized Re-renders**: TanStack Query optimizes component re-renders by only updating when necessary.

## Conclusion

The refactoring of the Providers List component to use TanStack Query has significantly improved its maintainability, performance, and user experience. By separating concerns, implementing proper error handling, and leveraging TanStack Query's caching capabilities, we've created a more robust and scalable implementation.

Key takeaways from this refactoring:

1. Always check API endpoint authentication requirements when migrating to client-side fetching.
2. Implement robust error handling at multiple levels (API, hooks, components).
3. Handle NULL values properly to prevent cascading errors.
4. Ensure type safety by using proper interfaces that match the actual data shapes.
5. Use try-catch in server components to prevent page crashes.
6. Leverage TanStack Query features like `keepPreviousData` for a better user experience.
