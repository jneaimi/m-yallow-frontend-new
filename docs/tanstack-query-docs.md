# TanStack Query Documentation

This document serves as an index for all TanStack Query documentation in the M-Yallow Frontend project. It provides links to detailed guides and explains how the documentation is structured.

## Available Documentation

### 1. [TanStack Query Reference Guide](./tanstack-query-reference.md)
   
A comprehensive reference guide covering all aspects of TanStack Query implementation in the project. It includes detailed information on core concepts, configuration, query hooks, mutations, and advanced patterns.

**Key topics:**
- Directory structure and configuration
- Core concepts (QueryClient, query keys, hooks)
- Basic and advanced usage patterns
- Server-side rendering integration
- Troubleshooting guides

### 2. [TanStack Query Quick Start Guide](./tanstack-query-quickstart.md)

A practical guide to get started quickly with TanStack Query in the project. It provides step-by-step examples for implementing common patterns and use cases.

**Key topics:**
- Basic query implementation
- Mutation implementation
- SSR and authentication integration
- Quick troubleshooting tips

### 3. [TanStack Query Patterns](./tanstack-query-patterns.md)

A detailed guide on recommended patterns and best practices for implementing TanStack Query in the project. It ensures consistency across the codebase and makes it easier to maintain and extend the application.

**Key topics:**
- Query key patterns
- Folder structure
- Custom hook patterns for different scenarios
- Mutation patterns
- Testing patterns
- Type-safety patterns

### 4. [TanStack Query Migration Guide](./tanstack-query-migration-guide.md)

A step-by-step guide for migrating existing code to use TanStack Query. It includes practical examples, common patterns, and troubleshooting tips to help you refactor your code effectively.

**Key topics:**
- Migration strategy
- Simple and complex migration examples
- Handling server components
- Handling authentication and forms
- Testing migrated code
- Troubleshooting migration issues

## Using This Documentation

### For New Developers

If you're new to the project or TanStack Query:

1. Start with the [Quick Start Guide](./tanstack-query-quickstart.md) to get a basic understanding of how TanStack Query is implemented in the project.
2. Then read the [Patterns](./tanstack-query-patterns.md) document to understand the recommended approaches for different scenarios.
3. Use the [Reference Guide](./tanstack-query-reference.md) as a comprehensive resource when you need detailed information.

### For Refactoring Existing Code

If you're migrating existing code to use TanStack Query:

1. Read the [Migration Guide](./tanstack-query-migration-guide.md) to understand the process and see examples.
2. Refer to the [Patterns](./tanstack-query-patterns.md) document to ensure your implementation follows project standards.
3. Use the [Reference Guide](./tanstack-query-reference.md) for detailed information on specific topics.

### For Troubleshooting

If you're experiencing issues with TanStack Query:

1. Check the Troubleshooting section in the [Reference Guide](./tanstack-query-reference.md).
2. For migration-specific issues, see the Troubleshooting section in the [Migration Guide](./tanstack-query-migration-guide.md).

## Implementation Progress

The TanStack Query implementation is being rolled out incrementally across the project. The initial setup and configuration has been completed, and now individual features are being migrated according to the sequenced refactoring plan.

Current status:
- ✅ Initial setup and configuration
- ❌ API client adapters
- ❌ Authentication integration
- ✅ Provider categories refactoring
- ✅ Provider category detail page (category/[id])
- ✅ Recent providers implementation
- ✅ Provider list implementation
- ❌ Provider detail implementation
- ❌ Provider reviews implementation
- ❌ Bookmarks implementation
- ❌ Search implementation
- ❌ Dashboard features implementation

## Common Issues and Solutions

Based on our implementation experiences, here are some common issues you might encounter when migrating to TanStack Query:

### 1. API Endpoint Authentication Requirements

**Issue**: Receiving `401 Unauthorized` errors when migrating existing fetch calls to TanStack Query.

**Solution**: 
- Always check if you're using the correct endpoint for the component context (public vs. authenticated).
- The M-Yallow API uses different endpoints for public data (`/public/providers`) vs. authenticated data (`/providers`).
- When migrating server-side fetching to client components, ensure you're using the appropriate endpoint.

```typescript
// Incorrect for unauthenticated client components
const res = await fetch(`${PROVIDER_API.LIST}?${params}`);

// Correct for unauthenticated client components
const res = await fetch(`${PROVIDER_API.PUBLIC}?${params}`);
```

### 2. Handling NULL Values in API Responses

**Issue**: Errors occurring when API responses contain NULL values that are used in components.

**Solution**:
- Always handle NULL values in your data transformation functions.
- Provide fallbacks for NULL values, especially for image URLs and other required fields.
- In component props, use default values or null coalescence operators.

```typescript
// In transformation function
heroImageUrl: apiProvider.hero_image_url || getFallbackImageUrl(),

// In component props
<ProviderCard
  heroImageUrl={provider.heroImageUrl || '/placeholder-image.jpg'}
/>
```

### 3. Robust Error Handling

**Issue**: Generic error messages or unhandled errors in API calls.

**Solution**:
- Implement detailed error handling in API functions.
- Log both the error message and the response status/text.
- Handle JSON parsing errors separately from fetch errors.
- Limit retry attempts for failed queries to avoid excessive failed requests.

```typescript
try {
  const res = await fetch(url);
  
  if (!res.ok) {
    console.warn(`API response not OK: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }
  
  let data;
  try {
    data = await res.json();
  } catch (parseError) {
    console.error('Failed to parse response:', parseError);
    throw new Error('Failed to parse response data');
  }
  
  return data;
} catch (error) {
  console.error('Error in API call:', error);
  throw error; // Re-throw for TanStack Query to handle
}
```

### 4. Consistent Data Transformation

**Issue**: Runtime errors when different components accessing the same query key expect different data structures.

**Solution**:
- Ensure all hooks using the same query key transform the data in the same way
- Standardize on a consistent output format for each query key
- Use the `queryFn` to transform the API response into the expected format

```typescript
// Consistent data transformation across hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: async () => {
      const data = await fetchPublicCategories();
      // Transform API response to standard format
      return data.categories.map(category => ({
        id: String(category.id),
        name: category.name,
        icon: category.icon
      }));
    }
  });
}

// Another hook using the same query key must expect the same structure
export function useCategoryName(categoryId) {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    // Same transformation as above to maintain consistency
    queryFn: async () => {
      const data = await fetchPublicCategories();
      return data.categories.map(category => ({
        id: String(category.id),
        name: category.name,
        icon: category.icon
      }));
    }
  });
  
  // Now we can safely assume query.data is an array of category objects
  const categoryName = query.data?.find(cat => String(cat.id) === categoryId)?.name || `Category ${categoryId}`;
  
  return { ...query, categoryName };
}
```

### 5. Server-Side Prefetching Alignment

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

## Additional Resources

- [Official TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Query Examples Repository](https://github.com/TanStack/query/tree/main/examples)
- [Next.js App Router Integration Guide](https://tanstack.com/query/latest/docs/react/guides/advanced-ssr)

## Implementation Examples

The following refactoring examples provide real-world implementation details and patterns:

1. [Browse Categories TanStack Query Refactoring](./refactoring-examples/categories-tanstack-refactoring.md) - Demonstrates handling React components in the cache and transforming data at render time
2. [Providers List TanStack Query Refactoring](./refactoring-examples/providers-list-tanstack-refactoring.md) - Shows how to implement pagination, filtering, and handle API authentication requirements
3. [Category Detail Page TanStack Query Refactoring](./refactoring-examples/category-detail-tanstack-refactoring.md) - Illustrates migrating from server components to a hybrid approach with consistent data transformation
