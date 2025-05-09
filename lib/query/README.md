# TanStack Query Implementation

This directory contains the TanStack Query (formerly React Query) setup for the application.

## Files

- `client.ts` - Defines and exports the QueryClient with default configuration
- `provider.tsx` - React component that provides the QueryClient to the app
- `keys.ts` - Collection of query key factories for consistent cache management
- `index.ts` - Main exports and re-exports from the query directory

## Usage

### Query Keys

Always use the predefined query keys from `keys.ts` to ensure consistency:

```tsx
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';

// Example: Fetch a provider by ID
const { data, isLoading } = useQuery({
  queryKey: queryKeys.provider.detail(123),
  queryFn: () => fetchProvider(123),
});
```

### Custom Hooks

Create custom hooks for reusable queries in domain-specific directories, for example:

```tsx
// hooks/providers/useProvider.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchProvider } from '@/lib/api';

export function useProvider(id: number) {
  return useQuery({
    queryKey: queryKeys.provider.detail(id),
    queryFn: () => fetchProvider(id),
    // Add any specific options here
  });
}
```

### Mutations

For data updates, use the `useMutation` hook and invalidate related queries:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProvider,
    onSuccess: (data, variables) => {
      // Invalidate the specific provider detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.detail(variables.id),
      });
      // Optionally invalidate the list query
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.list(),
      });
    },
  });
}
```

## Dev Tools

The React Query DevTools are automatically included in development mode. They can be accessed by clicking the floating button in the bottom right corner of the screen.
