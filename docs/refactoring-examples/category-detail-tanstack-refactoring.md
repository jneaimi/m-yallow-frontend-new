# Category Detail Page TanStack Query Refactoring

This document outlines the refactoring of the Category Detail page (`/providers/category/[id]`) to use TanStack Query. It provides a real-world example of migrating from direct server component data fetching to a hybrid server-client approach with TanStack Query.

## Original Implementation

The original implementation used Next.js server components with direct data fetching:

```tsx
// Original app/providers/category/[id]/page.tsx
export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.id;
  const categoryName = await getCategoryName(categoryId);
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        {/* Header and search */}
        <Suspense fallback={/* loading UI */}>
          <CategoryProviders categoryId={categoryId} />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}

// Server component for displaying providers
async function CategoryProviders({ categoryId }: { categoryId: string }) {
  const providers = await fetchProvidersByCategory(categoryId);
  const categoryName = await getCategoryName(categoryId);
  
  // Render UI with fetched data
}
```

## Refactored Implementation

The refactored implementation uses TanStack Query with server-side prefetching and client-side data management:

### 1. Custom Hooks

Created custom hooks for data fetching:

```tsx
// hooks/providers/use-providers-by-category.ts
export function useProvidersByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.provider.byCategory(categoryId),
    queryFn: () => fetchProvidersByCategory(categoryId),
    staleTime: 60 * 1000, // 60 seconds
  });
}

// hooks/categories/use-category-name.ts
export function useCategoryName(categoryId: string) {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: async () => {
      const data = await fetchPublicCategories();
      return data.categories.map(category => ({
        id: String(category.id),
        name: category.name,
        icon: category.icon
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Derive category name from the fetched data
  let categoryName = `Category ${categoryId}`;
  
  if (query.data && Array.isArray(query.data)) {
    const category = query.data.find(
      (cat) => String(cat.id) === categoryId
    );
    if (category) {
      categoryName = category.name;
    }
  }

  return {
    ...query,
    categoryName,
  };
}
```

### 2. Client Component

Created a client component to use the hooks:

```tsx
// components/providers/category-providers.tsx
'use client';

export function CategoryProviders({ categoryId }: CategoryProvidersProps) {
  const { 
    data: providers = [], 
    isLoading: isLoadingProviders,
    error,
    isError
  } = useProvidersByCategory(categoryId);
  
  const { 
    categoryName,
    isLoading: isLoadingCategory
  } = useCategoryName(categoryId);
  
  const isLoading = isLoadingProviders || isLoadingCategory;

  if (isLoading) {
    return <LoadingUI />;
  }
  
  if (isError) {
    return <ErrorUI error={error} />;
  }
  
  if (providers.length === 0) {
    return <EmptyStateUI />;
  }
  
  return (
    <>
      <div className="mb-4 text-muted-foreground">
        Found {providers.length} provider{providers.length !== 1 ? 's' : ''} in {categoryName}
      </div>
      
      <ProvidersGrid providers={providers} />
    </>
  );
}
```

### 3. Server Component with Prefetching

Updated the page component to prefetch data:

```tsx
// app/providers/category/[id]/page.tsx
export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.id;
  const queryClient = getQueryClient();
  
  // Prefetch both queries in parallel
  await Promise.all([
    // Prefetch providers by category
    queryClient.prefetchQuery({
      queryKey: queryKeys.provider.byCategory(categoryId),
      queryFn: () => fetchProvidersByCategory(categoryId),
    }),
    
    // Prefetch categories for the category name
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.public(),
      queryFn: async () => {
        const data = await fetchPublicCategories();
        return data.categories.map(category => ({
          id: String(category.id),
          name: category.name,
          icon: category.icon
        }));
      },
    })
  ]);
  
  // Get the categories data to determine the category name for the page header
  const categories = queryClient.getQueryData(queryKeys.categories.public()) as any[] | undefined;
  const categoryName = await getCategoryName(categoryId, categories || []);
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{categoryName} Providers</h1>
            {/* Navigation links */}
          </div>
          <SearchBar initialValue="" />
        </div>
        
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CategoryProviders categoryId={categoryId} />
        </HydrationBoundary>
      </ResponsiveContainer>
    </div>
  );
}
```

## Key Lessons Learned

### 1. Consistent Data Transformation

When multiple components use the same query key, they must expect the same data structure. We standardized the data transformation for `queryKeys.categories.public()` across different hooks and server prefetching.

### 2. Server/Client Data Consistency

The server component must transform fetched data to the same format that client hooks expect. Otherwise, hydration errors or runtime errors will occur.

### 3. Error Handling

Robust error handling and null checking significantly improved the reliability of the component. All data access was made conditional with fallbacks.

### 4. Loading States

Properly managing loading states across multiple queries ensures a smooth user experience. We combined loading states from both queries to show a single loading UI.

## Before and After Comparison

### Before:
- Direct data fetching in server components
- Separate fetch calls for each piece of data
- Manual error handling and state management
- No client-side caching

### After:
- Server-side prefetching with client-side data management
- Consolidated data fetching with parallel queries
- Standardized error handling and loading states
- Automatic caching and revalidation
- Consistent data transformation across components

## Integration with Existing Components

The refactored implementation maintains compatibility with existing UI components like `ProviderCard`, `SearchBar`, and `ResponsiveGrid`. This ensures visual consistency while improving the underlying data handling.

## Performance Considerations

- Server-side prefetching improves initial page load performance
- `staleTime` configuration prevents unnecessary refetches
- Error boundaries and fallbacks provide a better user experience
- Data transformation is optimized to minimize processing
