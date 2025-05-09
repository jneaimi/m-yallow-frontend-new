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
- Always throw errors rather than returning empty arrays or nulls to properly propagate errors to the UI.
- Use separate error handling for data structure validation vs. network errors.
- Limit retry attempts for failed queries to avoid excessive failed requests.
- Never silently handle errors by returning empty arrays or null values - this masks issues and makes debugging harder.

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
  
  // Validate response structure with specific error messages
  if (!data.providers) {
    throw new Error('Unexpected API response format: "providers" field is missing');
  }
  
  if (!Array.isArray(data.providers)) {
    throw new Error('Unexpected API response format: "providers" is not an array');
  }
  
  return transformData(data.providers);
} catch (error) {
  console.error('Error in API call:', error);
  throw error; // Re-throw for TanStack Query to handle - NEVER return empty arrays or nulls
}
```

### 4. Shared Data Transformation Functions

**Issue**: Duplicated transformation logic across components and hooks, leading to inconsistent data structures and potential bugs.

**Solution**:
- Create dedicated transformation functions in your API modules
- Use shared query functions that can be imported directly
- Ensure all components accessing the same data use the same transformation logic
- Follow a "transform at the boundary" pattern where data is normalized immediately after API calls

```typescript
// In your API module (e.g., categories.ts)
export interface ApiCategory {
  id: number;
  name: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// Single transformation function for consistent formatting
export function transformCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    icon: category.icon
  };
}

// Helper for transforming arrays
export function transformCategories(categories: ApiCategory[]): Category[] {
  return categories.map(transformCategory);
}

// Shared query function for TanStack Query
export async function categoriesQueryFn() {
  const data = await fetchPublicCategories();
  return transformCategories(data.categories);
}

// Usage in hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.public(),
    // Simply import and use the shared query function
    queryFn: categoriesQueryFn
  });
}

// Server-side prefetching with the same function
await queryClient.prefetchQuery({
  queryKey: queryKeys.categories.public(),
  queryFn: categoriesQueryFn
});
```

This approach ensures that all components receive exactly the same data structure when accessing the same query key, preventing subtle bugs that can occur with inconsistent transformations.

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

### 6. Optimizing Query Execution with the `enabled` Option

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

### 7. Environment-Aware Fetch Options

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

### 8. URL Parameter Encoding

**Issue**: Potential security and functionality issues when using unencoded URL parameters.

**Solution**:
- Always use `encodeURIComponent()` for dynamic parameters in URL strings.
- This prevents issues with special characters (spaces, ampersands, etc.) that could break your URLs.
- Critical for category IDs, search queries, or any user-provided inputs used in URLs.

```typescript
// Unsafe - could break if categoryId contains special characters
const endpoint = `${PROVIDER_API.PUBLIC}?category=${categoryId}`;

// Safe - properly encodes any special characters
const endpoint = `${PROVIDER_API.PUBLIC}?category=${encodeURIComponent(categoryId)}`;
```

### 9. Shared Query Functions with Transformation

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



- [Official TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Query Examples Repository](https://github.com/TanStack/query/tree/main/examples)
- [Next.js App Router Integration Guide](https://tanstack.com/query/latest/docs/react/guides/advanced-ssr)

## Implementation Examples

The following refactoring examples provide real-world implementation details and patterns:

1. [Browse Categories TanStack Query Refactoring](./refactoring-examples/categories-tanstack-refactoring.md) - Demonstrates handling React components in the cache and transforming data at render time
2. [Providers List TanStack Query Refactoring](./refactoring-examples/providers-list-tanstack-refactoring.md) - Shows how to implement pagination, filtering, and handle API authentication requirements
3. [Category Detail Page TanStack Query Refactoring](./refactoring-examples/category-detail-tanstack-refactoring.md) - Illustrates migrating from server components to a hybrid approach with consistent data transformation
