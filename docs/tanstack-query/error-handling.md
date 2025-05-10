# Error Handling and API Integration

This document outlines best practices for error handling and API integration when using TanStack Query in the M-Yallow Frontend project.

## 1. Robust Error Handling

**Issue**: Generic error messages or unhandled errors in API calls.

**Solution**:
- Implement detailed error handling in API functions.
- Log both the error message and the response status/text.
- Always throw errors rather than returning empty arrays or nulls to properly propagate errors to the UI.
- Use separate error handling for data structure validation vs. network errors.
- Always validate API response structure before accessing properties to prevent runtime errors.
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

## 2. API Endpoint Authentication Requirements

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

## 3. URL Parameter Encoding

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

## 4. Next.js App Router and Dynamic Route Parameters

**Issue**: Using dynamic route parameters like `searchParams` directly without awaiting them can cause errors in Next.js App Router.

**Solution**:
- Always await dynamic route parameters before using them
- Use `Promise.resolve()` to handle both promise and non-promise values

```typescript
export default async function SomePage({ searchParams }: PageProps) {
  // Ensure searchParams is fully resolved before accessing properties
  const resolvedParams = await Promise.resolve(searchParams);
  
  // Now safely access properties
  const someValue = resolvedParams.someValue;
  
  // Continue with the component logic using the resolved values
}
```

This approach works correctly in all Next.js versions:
- In older versions, `searchParams` is already a resolved object, so `Promise.resolve()` returns it immediately
- In newer versions, `searchParams` might be a promise that needs to be awaited
- Using `Promise.resolve()` handles both cases safely

## 5. React Query Version Compatibility

**Issue**: API differences between React Query v4 and v5, particularly around loading state properties.

**Solution**:
- Use a compatibility approach that works with both versions when writing mutation components
- React Query v5 uses `isPending` while v4 uses `isLoading` for mutations
- Check both properties to ensure compatibility across versions or environments

```typescript
// Version-specific approach (breaks in different versions)
// Will work in v5 but break in v4:
const isPending = mutation.isPending;
// Will work in v4 but might be deprecated in future v5 updates:
const isLoading = mutation.isLoading;

// Version-compatible approach (works in both v4 and v5)
const isProcessing = mutation.isPending || mutation.isLoading;

// For error handling, prefer nullish coalescing over logical OR
// This properly handles cases where one error might be falsy but valid
const error = primaryMutation.error ?? fallbackMutation.error;

// In components:
<Button 
  type="submit" 
  disabled={isProcessing}
>
  {isProcessing ? 'Processing...' : 'Submit'}
</Button>
```

By using this compatibility pattern, your code will be resilient to version differences, which is particularly important when:
- Different parts of the application may be running different versions during gradual upgrades
- Working with third-party libraries that might use their own version of React Query
- Preparing for future version upgrades
