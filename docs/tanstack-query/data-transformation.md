# Data Transformation Best Practices

This document outlines best practices for transforming data between API responses and UI components when using TanStack Query in the M-Yallow Frontend project.

## 1. Shared Data Transformation Functions

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

## 2. Handling NULL Values in API Responses

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

## 3. Robust Category Data Transformation

**Issue**: API responses containing categories with potential missing or malformed data can cause runtime errors or inaccurate UI display.

**Solution**:
- Implement robust transformation functions that handle various edge cases
- Use optional chaining, nullish coalescing, and filtering to ensure data integrity
- Consider both object-based and string-based category representations

```typescript
// Before: Fragile transformation that assumes valid structure
categories: provider.categories || [],

// After: Robust transformation that handles edge cases
categories: provider.categories
  ?.map(cat => cat.name || 'Uncategorized')
  .filter(Boolean) ?? [],
```

This approach:
- Safely handles potentially undefined `categories` with optional chaining (`?.`)
- Extracts category names and provides a fallback if name is missing
- Filters out any empty or falsy values with `filter(Boolean)`
- Defaults to an empty array if the entire categories array is null/undefined

## 4. Consistent User Experience with Mock Data

**Issue**: Inconsistent UI states and user experience when API endpoints are unavailable or still under development.

**Solution**:
- Provide realistic mock data when API endpoints return errors or unexpected formats
- Ensure mock data follows the same interface structure as the expected API response
- Use consistent error handling patterns across similar hooks
- Document which endpoints use mock data for easier tracking during development

```typescript
// Example hook with mock data fallback
export function useProviderServices() {
  // ...query implementation
  
  queryFn: async () => {
    try {
      const apiClient = await getApiClient();
      const response = await apiClient.get('/providers/me/services');
      
      // Validate response structure
      if (response.data && Array.isArray(response.data.services)) {
        return response.data.services;
      }
      throw new Error('Invalid response format from API');
    } catch (err) {
      // If the API doesn't support services yet, return mock data
      console.warn('Error fetching provider services, using sample data:', err);
      
      // Return sample data that matches expected interface
      return [
        { id: '1', name: 'Basic Consultation', description: 'Initial 30-minute consultation', price: 50 },
        { id: '2', name: 'Standard Package', description: 'Comprehensive service package', price: 200 },
        { id: '3', name: 'Premium Support', description: 'Priority support and advanced features', price: 500 }
      ];
    }
  }
}
```

This approach ensures:
- Users see realistic data during development even when APIs aren't complete
- Frontend development can progress independently of backend API readiness
- Consistent UI states across the application
- Easier testing and demos without requiring full backend functionality
