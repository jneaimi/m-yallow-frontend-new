# Provider Detail Page TanStack Query Refactoring

This document outlines the refactoring of the Provider Detail page (`/providers/[id]/page.tsx`) to use TanStack Query according to the project's TanStack Query patterns.

## ✅ IMPLEMENTATION COMPLETE

> The refactoring described in this document has been fully implemented and deployed. The Provider Detail page is now using TanStack Query for data fetching, with proper server-side prefetching and client-side state management.

## Files Refactored

1. **Custom Hook**: `/hooks/providers/use-provider.ts` (new)
2. **Client Component**: `/components/providers/provider-detail-client.tsx` (replaced)
3. **Page Component**: `/app/providers/[id]/page.tsx` (replaced)

Original files have been preserved and are now stored in the `/docs/refactoring-examples/backup-files/` directory:
- `/docs/refactoring-examples/backup-files/provider-detail-client-original.tsx`
- `/docs/refactoring-examples/backup-files/provider-detail-page-original.tsx`

## Refactoring Approach

### 1. Custom Hook Creation

The `useProvider` hook encapsulates the data fetching logic:

```typescript
// hooks/providers/use-provider.ts
export async function fetchProvider(id: string | number) {
  try {
    const url = PROVIDER_API.DETAIL(id);
    
    // Check if code is running on the server
    const isServer = typeof window === 'undefined';
    
    // Apply Next.js cache options only on the server
    const res = await fetch(
      url,
      isServer ? 
        { next: { revalidate: 60 } } : 
        undefined
    );
    
    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch provider: ${res.status} ${res.statusText}`);
    }
    
    const provider = await res.json() as ApiProvider;
    
    // Transform API provider to client provider format
    return transformProvider(provider);
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error instanceof Error ? error.message : String(error));
    throw error; // Re-throw so TanStack Query can handle it
  }
}

export function useProvider(id: string | number) {
  return useQuery({
    queryKey: queryKeys.provider.detail(typeof id === 'string' ? parseInt(id) : id),
    queryFn: () => fetchProvider(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute to match current revalidation time
  });
}
```

Key improvements:
- Dedicated fetch function (`fetchProvider`) that can be used by both client and server components
- Environment detection for appropriate fetch options
- Proper error handling with re-throwing for TanStack Query
- Typed return values for better type safety

### 2. Client Component Refactoring

The client component was refactored from receiving a provider object prop to using the custom hook:

```typescript
// Before:
interface ProviderDetailClientProps {
  provider: {
    // Provider properties
  };
}

// After:
interface ProviderDetailClientProps {
  providerId: string;
}
```

Key changes:
- Component now handles its own data fetching using the hook
- Added loading and error states with appropriate UI
- Simplified prop interface (just needs the ID)
- More resilient to data format changes

### 3. Page Component Refactoring

The server component was refactored to use TanStack Query prefetching:

```typescript
export default async function ProviderPage({ params }: ProviderPageProps) {
  const queryClient = getQueryClient();
  
  // Prefetch the provider data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.provider.detail(parseInt(params.id)),
    queryFn: () => fetchProvider(params.id),
  });
  
  // Check if the provider exists to handle notFound()
  const provider = queryClient.getQueryData(queryKeys.provider.detail(parseInt(params.id)));
  
  if (!provider) {
    notFound();
  }
  
  // Render the client component with the hydrated query client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProviderDetailClient providerId={params.id} />
    </HydrationBoundary>
  );
}
```

Key improvements:
- Proper handling of async data fetching
- Server-side prefetching for optimal performance
- Hydration of the query client for client-side data reuse
- Simplified page component that focuses on rendering and data prefetching
- Maintained proper error handling and notFound() behavior

## Benefits of the Refactoring

1. **Better Separation of Concerns**:
   - Data fetching logic is isolated in the custom hook
   - Component logic is focused on rendering and state management
   - Server component handles SEO and prefetching

2. **Improved Data Sharing**:
   - The provider data is now cached and can be reused across components
   - Subsequent navigations to the same provider page will use cached data

3. **Enhanced Error Handling**:
   - Consistent error handling patterns throughout
   - Clear loading, error, and not-found states in the UI

4. **Type Safety**:
   - Better TypeScript typing throughout the code
   - Consistent data structures with proper transformations

5. **Maintainability**:
   - Easier to test individual components and hooks
   - Follows project TanStack Query patterns for consistency
   - More modular structure for future changes

## Detailed Changes

### Hook Logic

The hook includes:

1. **Environment Detection**: Uses `typeof window === 'undefined'` to determine if code is running on the server or client
2. **Conditional Options**: Applies Next.js revalidation options only on the server side
3. **Error Handling**: Properly handles not found (404) vs other errors
4. **Proper Logging**: Logs important information for debugging
5. **Data Transformation**: Uses the existing `transformProvider` function to standardize data format

### Client Component Logic

The client component includes:

1. **Loading State**: Shows a spinner during data fetching
2. **Error State**: Shows a friendly error message with a back button
3. **Not Found State**: Shows a specific UI for missing providers
4. **Conditional Rendering**: Only renders sections that have data (maps, categories, etc.)
5. **Typed Interface**: Uses a simpler interface that just takes a provider ID

### Page Component Logic

The page component includes:

1. **Server Prefetching**: Fetches data on the server for optimal performance
2. **Metadata Generation**: Creates SEO-friendly metadata based on the provider data
3. **Not Found Handling**: Properly redirects to the 404 page for missing providers
4. **Error Handling**: Catches and logs errors appropriately
5. **Hydration**: Properly hydrates the query client state to the client components

## Testing Scenarios & Results

The refactored implementation has been tested against these scenarios:

1. ✅ **Happy Path**: Successfully loads valid providers with all data
2. ✅ **Not Found**: Properly redirects to 404 page for non-existent providers
3. ✅ **Error Handling**: Shows proper error UI when API errors occur
4. ✅ **SEO**: Correctly generates metadata for valid providers
5. ✅ **Features**: All features (reviews, location, bookmarks) continue to work
6. ✅ **Performance**: Page loads quickly with prefetched data
7. ✅ **Navigation**: Navigating between providers uses cached data

## Future Improvements

Potential future improvements for this implementation:

1. **Invalidation Strategy**: Implement a more refined cache invalidation strategy for when provider data changes
2. **Optimistic Updates**: Add optimistic updates for interactions like bookmarking
3. **Error Boundaries**: Implement React Error Boundaries for more graceful error handling
4. **Related Providers**: Prefetch related providers based on categories for faster navigation

## Conclusion

The Provider Detail page has been successfully refactored to use TanStack Query, following the project's established patterns and best practices. The implementation provides better performance, more consistent error handling, and improved maintainability.
