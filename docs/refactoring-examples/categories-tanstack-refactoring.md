# Browse Categories TanStack Query Refactoring

This document describes the refactoring of the Browse Categories component to use TanStack Query, including key patterns, learnings, and implementation details.

## Overview

The Browse Categories component was successfully refactored from a traditional server component using direct fetch calls to a client component using TanStack Query for data fetching. This refactoring improved the component's performance, maintainability, and user experience.

### Key Changes

1. Server Component → Client Component with TanStack Query
2. Direct fetch calls → Custom hooks
3. Manual error/loading handling → TanStack Query state management
4. Improved separation of concerns

## Implementation Details

### 1. TanStack Query Integration

The refactoring process involved:

- Creating a custom `useCategories` hook
- Adding category-specific query keys
- Updating components to consume the hook
- Adding skeleton loading states
- Implementing proper error handling
- Setting up server-side prefetching

### 2. Component Structure

The refactored implementation follows this structure:

```
hooks/
└── categories/
    └── use-categories.ts       # Custom hook for fetching categories

components/providers/
├── categories-carousel.tsx     # UI for displaying categories in a carousel
├── hybrid-categories-tanstack.tsx   # Client component combining carousel and modal
└── categories-modal-tanstack.tsx    # TanStack Query integrated modal component

app/providers/
├── hybrid-public-categories.tsx     # Main component using TanStack Query
└── layout.tsx                       # Layout with server-side prefetching
```

### 3. Key Challenges and Solutions

#### Challenge: Handling React Components in Cache

One significant challenge was ensuring React components (icons) were properly rendered after page navigation. The initial implementation lost icon components when navigating away and back to the page.

**Solution:**

Implemented a two-step approach:
1. Store the raw data (with icon names as strings) in the TanStack Query cache
2. Use `useMemo` to transform the data (icon strings to React components) when accessed

```typescript
export function useCategories() {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: async () => {
      // Return raw categories with icon as string for caching
      return categories.map(category => ({
        id: String(category.id),
        name: category.name,
        icon: category.icon, // Store as string for caching
        description: `Find ${category.name} providers and services`
      }));
    },
  });
  
  // Process the raw data to transform string icons into React components
  const processedCategories = useMemo(() => {
    if (!query.data) return undefined;
    
    return query.data.map((category: RawCategory) => ({
      id: String(category.id),
      name: category.name,
      // Transform string icons to React components
      icon: typeof category.icon === 'string' ? getIconByName(category.icon) : category.icon,
      description: category.description || `Find ${category.name} providers and services`
    }));
  }, [query.data]);
  
  // Return the query object with processed data
  return {
    ...query,
    data: processedCategories
  };
}
```

#### Challenge: Shared Data Between Components

Another challenge was ensuring both the carousel and the modal used consistent data.

**Solution:**

The modal component was updated to directly use the same `useCategories` hook, ensuring consistent data:

```typescript
export function CategoriesModalTanstack({ isOpen, onClose }: CategoriesModalTanstackProps) {
  // Use the same hook as the parent component
  const { data: categories, isLoading, error } = useCategories();
  
  // Rest of the component...
}
```

### 4. Benefits of the Refactoring

1. **Better State Management**: TanStack Query now handles loading, error, and data states.
2. **Improved Performance**: Data is cached, preventing unnecessary fetches.
3. **Better UX**: Proper skeleton loading states during data fetching.
4. **Cleaner Code Structure**: Clear separation between data fetching and UI rendering.
5. **Consistent Data**: Same data source used for both carousel and modal.
6. **Better Navigation Experience**: React components properly rendered after navigation.

### 5. Testing Considerations

When testing components that use this pattern:

1. Mock the TanStack Query hook, not just the fetch function
2. Test both initial data loading and subsequent renders from cache
3. Ensure React components are properly rendered in both scenarios

## Implementation Pattern for Similar Refactorings

For similar components with non-serializable data (like React nodes):

1. Create a custom hook that uses TanStack Query for data fetching
2. Store only serializable data in the cache
3. Use useMemo to transform cached data when accessed
4. Return the transformed data with the rest of the query result
5. Ensure all components use the same hook for consistent data

## Lessons Learned

1. **Cache Only Serializable Data**: Store only JSON-serializable data in the TanStack Query cache.
2. **Transform at Render Time**: Create React components and other non-serializable data at render time.
3. **Use useMemo for Performance**: Optimize transformations with useMemo.
4. **Consistent Data Access**: Use the same hook in all components that need the same data.
5. **Proper Type Safety**: Use TypeScript interfaces to ensure proper typing through the transformation process.

## Related Documentation

For more information, refer to:
- [TanStack Query Patterns](../tanstack-query-patterns.md) - See the "Data Transformation Hook" pattern
- [TanStack Query Migration Guide](../tanstack-query-migration-guide.md)
