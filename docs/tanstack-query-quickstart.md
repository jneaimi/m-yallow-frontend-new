# TanStack Query Quick Start Guide

This quick start guide will help you get up and running with TanStack Query in the M-Yallow Frontend project. It provides practical examples and a step-by-step approach to implementing data fetching using TanStack Query.

## Getting Started

TanStack Query has already been set up in the project with a centralized configuration. You can start using it immediately with the provided hooks and utilities.

## Basic Query Implementation

### Step 1: Define a Query Function

First, you need a function that fetches data from your API:

```typescript
// lib/api/my-feature.ts
import { API_BASE_URL } from '@/services/api';

export async function fetchItems() {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  return response.json();
}
```

### Step 2: Create a Custom Hook

Create a custom hook using TanStack Query's `useQuery`:

```typescript
// hooks/use-items.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchItems } from '@/lib/api/my-feature';

export function useItems() {
  return useQuery({
    queryKey: queryKeys.items.all(),
    queryFn: fetchItems,
  });
}
```

If the query key doesn't exist yet, add it to the `queryKeys` object in `lib/query/keys.ts`:

```typescript
// lib/query/keys.ts
export const queryKeys = {
  // ... existing keys
  items: {
    all: () => ['items'] as const,
    detail: (id: number) => ['items', id] as const,
  },
};
```

### Step 3: Use the Hook in Your Component

Now you can use your custom hook in a component:

```tsx
// components/items-list.tsx
'use client';

import { useItems } from '@/hooks/use-items';

export function ItemsList() {
  const { data, isLoading, error } = useItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## Implementing a Mutation

### Step 1: Define a Mutation Function

Create a function that performs the data mutation:

```typescript
// lib/api/my-feature.ts
export async function createItem(newItem) {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create item');
  }
  
  return response.json();
}
```

### Step 2: Create a Custom Mutation Hook

Create a custom hook using TanStack Query's `useMutation`:

```typescript
// hooks/use-create-item.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { createItem } from '@/lib/api/my-feature';

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      // Invalidate the items list query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.items.all(),
      });
    },
  });
}
```

### Step 3: Use the Mutation Hook in Your Component

Now you can use your mutation hook in a component:

```tsx
// components/add-item-form.tsx
'use client';

import { useState } from 'react';
import { useCreateItem } from '@/hooks/use-create-item';

export function AddItemForm() {
  const [name, setName] = useState('');
  const createItemMutation = useCreateItem();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createItemMutation.mutate({ name });
    setName('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
      />
      
      <button 
        type="submit" 
        disabled={createItemMutation.isPending}
      >
        {createItemMutation.isPending ? 'Adding...' : 'Add Item'}
      </button>
      
      {createItemMutation.isError && (
        <div>Error: {createItemMutation.error.message}</div>
      )}
      
      {createItemMutation.isSuccess && (
        <div>Item added successfully!</div>
      )}
    </form>
  );
}
```

## Server-Side Rendering (SSR)

For pages that need data at build/request time:

```tsx
// app/items/page.tsx
import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchItems } from '@/lib/api/my-feature';
import { ItemsList } from '@/components/items-list';

export default async function ItemsPage() {
  const queryClient = getQueryClient();
  
  // Prefetch the items data
  await queryClient.prefetchQuery({
    queryKey: queryKeys.items.all(),
    queryFn: fetchItems,
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1>Items</h1>
      <ItemsList />
    </HydrationBoundary>
  );
}
```

## Authentication Integration

When working with authenticated requests:

```typescript
// hooks/use-protected-items.ts
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProtectedItems } from '@/lib/api/my-feature';

export function useProtectedItems() {
  const { isSignedIn, getToken } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.items.protected(),
    queryFn: async () => {
      const token = await getToken();
      return fetchProtectedItems(token);
    },
    // Only run this query if the user is signed in
    enabled: !!isSignedIn,
  });
}
```

## Optimistic Updates

For a better user experience with immediate UI updates:

```typescript
// hooks/use-update-item.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { updateItem } from '@/lib/api/my-feature';

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateItem,
    onMutate: async (updatedItem) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.items.detail(updatedItem.id) 
      });
      
      // Snapshot the previous value
      const previousItem = queryClient.getQueryData(
        queryKeys.items.detail(updatedItem.id)
      );
      
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.items.detail(updatedItem.id), 
        updatedItem
      );
      
      // Also update the item in the items list if it exists
      queryClient.setQueryData(
        queryKeys.items.all(), 
        (old) => old?.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      
      return { previousItem };
    },
    onError: (err, updatedItem, context) => {
      // Revert the optimistic update
      queryClient.setQueryData(
        queryKeys.items.detail(updatedItem.id), 
        context?.previousItem
      );
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.items.detail(variables.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.items.all() 
      });
    },
  });
}
```

## Troubleshooting

If you encounter issues using TanStack Query:

1. Check the React Query DevTools by clicking the floating button in the bottom-right corner of the screen (in development mode).

2. Verify that your query key structure matches what's in `queryKeys.ts`.

3. Check the Network tab in your browser's developer tools to confirm API requests are being made correctly.

4. Ensure your query functions are handling errors properly by throwing errors for non-2xx responses.

## Next Steps

For more advanced usage and detailed information, refer to the comprehensive [TanStack Query Reference Guide](./tanstack-query-reference.md) and the official [TanStack Query documentation](https://tanstack.com/query/latest/docs/react/overview).
