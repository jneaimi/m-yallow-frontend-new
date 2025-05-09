# TanStack Query Migration Guide

This guide provides a step-by-step approach for migrating existing code to use TanStack Query in the M-Yallow Frontend project. It includes practical examples, common patterns, and troubleshooting tips to help you refactor your code effectively.

## Table of Contents

1. [Migration Strategy](#migration-strategy)
2. [Simple Migration Example](#simple-migration-example)
3. [Complex Migration Example](#complex-migration-example)
4. [Handling Server Components](#handling-server-components)
5. [Handling Authentication](#handling-authentication)
6. [Handling Forms and Mutations](#handling-forms-and-mutations)
7. [Testing Migrated Code](#testing-migrated-code)
8. [Troubleshooting](#troubleshooting)

## Migration Strategy

Follow these general steps when migrating existing code to TanStack Query:

1. **Identify the data requirements**: Determine what data is being fetched, when it's needed, and how it's used.
2. **Convert API functions**: Ensure your API functions are compatible with TanStack Query (return promises, throw errors for failed requests).
3. **Create custom hooks**: Implement reusable hooks using TanStack Query.
4. **Update components**: Replace existing data fetching with your new hooks.
5. **Test thoroughly**: Verify loading states, error handling, and data display.

Start with simpler, more isolated components before moving to complex ones.

## Simple Migration Example

### Before: Using useState and useEffect

```tsx
// components/provider-list.tsx (before)
import { useState, useEffect } from 'react';
import { fetchProviders } from '@/lib/api';

export function ProviderList() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProviders = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProviders();
        setProviders(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getProviders();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {providers.map((provider) => (
        <div key={provider.id}>{provider.name}</div>
      ))}
    </div>
  );
}
```

### Step 1: Create a Custom Hook

```typescript
// hooks/providers/use-providers.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProviders } from '@/lib/api';

export function useProviders() {
  return useQuery({
    queryKey: queryKeys.provider.list(),
    queryFn: fetchProviders,
  });
}
```

### Step 2: Update the Component

```tsx
// components/provider-list.tsx (after)
import { useProviders } from '@/hooks/providers/use-providers';

export function ProviderList() {
  const { data: providers, isLoading, error } = useProviders();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {providers?.map((provider) => (
        <div key={provider.id}>{provider.name}</div>
      ))}
    </div>
  );
}
```

## Complex Migration Example

### Before: Using Multiple API Calls

```tsx
// components/provider-detail-page.tsx (before)
import { useState, useEffect } from 'react';
import { fetchProvider, fetchProviderReviews } from '@/lib/api';

export function ProviderDetailPage({ id }) {
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [providerError, setProviderError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const getProvider = async () => {
      try {
        setIsLoadingProvider(true);
        const data = await fetchProvider(id);
        setProvider(data);
        setProviderError(null);
      } catch (err) {
        setProviderError(err.message);
      } finally {
        setIsLoadingProvider(false);
      }
    };

    getProvider();
  }, [id]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const data = await fetchProviderReviews(id);
        setReviews(data);
        setReviewsError(null);
      } catch (err) {
        setReviewsError(err.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    getReviews();
  }, [id]);

  // Render logic...
}
```

### Step 1: Create Custom Hooks

```typescript
// hooks/providers/use-provider.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProvider } from '@/lib/api';

export function useProvider(id) {
  return useQuery({
    queryKey: queryKeys.provider.detail(id),
    queryFn: () => fetchProvider(id),
    enabled: !!id,
  });
}
```

```typescript
// hooks/reviews/use-provider-reviews.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchProviderReviews } from '@/lib/api';

export function useProviderReviews(providerId) {
  return useQuery({
    queryKey: queryKeys.reviews.byProvider(providerId),
    queryFn: () => fetchProviderReviews(providerId),
    enabled: !!providerId,
  });
}
```

### Step 2: Update the Component

```tsx
// components/provider-detail-page.tsx (after)
import { useProvider } from '@/hooks/providers/use-provider';
import { useProviderReviews } from '@/hooks/reviews/use-provider-reviews';

export function ProviderDetailPage({ id }) {
  const {
    data: provider,
    isLoading: isLoadingProvider,
    error: providerError,
  } = useProvider(id);

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useProviderReviews(id);

  // Loading states
  if (isLoadingProvider) return <div>Loading provider...</div>;
  if (providerError) return <div>Error loading provider: {providerError.message}</div>;
  if (!provider) return <div>Provider not found</div>;

  return (
    <div>
      <h1>{provider.name}</h1>
      <p>{provider.description}</p>
      
      <h2>Reviews</h2>
      {isLoadingReviews ? (
        <div>Loading reviews...</div>
      ) : reviewsError ? (
        <div>Error loading reviews: {reviewsError.message}</div>
      ) : reviews?.length === 0 ? (
        <div>No reviews yet</div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id}>
              <p>{review.content}</p>
              <p>Rating: {review.rating}/5</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Handling Server Components

In Next.js App Router, you might have Server Components that fetch data directly. Here's how to migrate them:

### Before: Server Component with Direct Fetch

```tsx
// app/providers/[id]/page.tsx (before)
export default async function ProviderPage({ params }) {
  const providerId = parseInt(params.id);
  
  try {
    const provider = await fetchProvider(providerId);
    
    if (!provider) {
      notFound();
    }
    
    return <ProviderDetailClient provider={provider} />;
  } catch (error) {
    throw new Error(`Failed to load provider: ${error.message}`);
  }
}
```

### After: Server Component with TanStack Query

```tsx
// app/providers/[id]/page.tsx (after)
import { getQueryClient } from '@/lib/query/client';
import { queryKeys } from '@/lib/query/keys';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchProvider } from '@/lib/api';
import { ProviderDetailClient } from '@/components/providers/provider-detail-client';

export default async function ProviderPage({ params }) {
  const providerId = parseInt(params.id);
  const queryClient = getQueryClient();
  
  try {
    // Prefetch the provider data on the server
    await queryClient.prefetchQuery({
      queryKey: queryKeys.provider.detail(providerId),
      queryFn: () => fetchProvider(providerId),
    });
    
    // Check if provider exists to handle notFound()
    const provider = queryClient.getQueryData(queryKeys.provider.detail(providerId));
    
    if (!provider) {
      notFound();
    }
    
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProviderDetailClient providerId={providerId} />
      </HydrationBoundary>
    );
  } catch (error) {
    throw new Error(`Failed to load provider: ${error.message}`);
  }
}
```

And update the client component:

```tsx
// components/providers/provider-detail-client.tsx
'use client';

import { useProvider } from '@/hooks/providers/use-provider';

export function ProviderDetailClient({ providerId }) {
  const { data: provider } = useProvider(providerId);
  
  // The data is already available from the server
  return (
    <div>
      <h1>{provider.name}</h1>
      <p>{provider.description}</p>
    </div>
  );
}
```

## Handling Authentication

Migrating authenticated data fetching requires special consideration:

### Before: Using Auth Hook and Direct API Calls

```tsx
// components/user-bookmarks.tsx (before)
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createClientApiClient } from '@/lib/api-client';

export function UserBookmarks() {
  const { isSignedIn, userId } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!isSignedIn) {
        setBookmarks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const apiClient = await createClientApiClient();
        const response = await apiClient.get('/providers/users/me/bookmarks');
        setBookmarks(response.data.bookmarks);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [isSignedIn, userId]);

  // Render logic...
}
```

### After: Using TanStack Query with Auth

```typescript
// hooks/bookmarks/use-bookmarks.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useAuth } from '@clerk/nextjs';
import { useApiClient } from '@/lib/api-client/client';

export function useBookmarks() {
  const { isSignedIn } = useAuth();
  const getApiClient = useApiClient();

  return useQuery({
    queryKey: queryKeys.bookmarks.list(),
    queryFn: async () => {
      const apiClient = await getApiClient();
      const response = await apiClient.get('/providers/users/me/bookmarks');
      return response.data.bookmarks;
    },
    enabled: !!isSignedIn, // Only run if the user is signed in
  });
}
```

```tsx
// components/user-bookmarks.tsx (after)
import { useBookmarks } from '@/hooks/bookmarks/use-bookmarks';

export function UserBookmarks() {
  const { data: bookmarks, isLoading, error } = useBookmarks();

  if (isLoading) return <div>Loading bookmarks...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!bookmarks?.length) return <div>No bookmarks yet</div>;

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <div key={bookmark.provider_id}>
          Provider ID: {bookmark.provider_id}
        </div>
      ))}
    </div>
  );
}
```

## Handling Forms and Mutations

Migrating form submissions and data mutations:

### Before: Using useState and Direct API Calls

```tsx
// components/add-review-form.tsx (before)
import { useState } from 'react';
import { createClientApiClient } from '@/lib/api-client';

export function AddReviewForm({ providerId }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const apiClient = await createClientApiClient();
      await apiClient.post(`/providers/${providerId}/reviews`, {
        content,
        rating,
      });
      
      setSuccess(true);
      setContent('');
      setRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Review submitted successfully!</div>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

### After: Using TanStack Query Mutation

```typescript
// hooks/reviews/use-add-review.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useApiClient } from '@/lib/api-client/client';

export function useAddReview() {
  const queryClient = useQueryClient();
  const getApiClient = useApiClient();

  return useMutation({
    mutationFn: async ({ providerId, content, rating }) => {
      const apiClient = await getApiClient();
      const response = await apiClient.post(`/providers/${providerId}/reviews`, {
        content,
        rating,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate provider reviews to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byProvider(variables.providerId),
      });
      
      // Invalidate user reviews if applicable
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byUser('me'),
      });
    },
  });
}
```

```tsx
// components/add-review-form.tsx (after)
import { useState } from 'react';
import { useAddReview } from '@/hooks/reviews/use-add-review';

export function AddReviewForm({ providerId }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  
  const addReviewMutation = useAddReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addReviewMutation.mutate(
      {
        providerId,
        content,
        rating,
      },
      {
        onSuccess: () => {
          // Reset form after successful submission
          setContent('');
          setRating(5);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {addReviewMutation.isError && (
        <div className="error">{addReviewMutation.error.message}</div>
      )}
      {addReviewMutation.isSuccess && (
        <div className="success">Review submitted successfully!</div>
      )}
      <button type="submit" disabled={addReviewMutation.isPending}>
        {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

## Testing Migrated Code

When testing migrated code, you need to create a wrapper that provides the QueryClient:

```tsx
// test/utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export function renderWithClient(ui) {
  const wrapper = createWrapper();
  return render(ui, { wrapper });
}
```

Then use it in your tests:

```tsx
// components/provider-list.test.tsx
import { screen, waitFor } from '@testing-library/react';
import { renderWithClient } from '@/test/utils';
import { ProviderList } from './provider-list';
import { fetchProviders } from '@/lib/api';

// Mock the API function
jest.mock('@/lib/api', () => ({
  fetchProviders: jest.fn(),
}));

describe('ProviderList', () => {
  it('renders providers when data is available', async () => {
    // Mock the API response
    (fetchProviders as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Provider 1' },
      { id: 2, name: 'Provider 2' },
    ]);
    
    renderWithClient(<ProviderList />);
    
    // Initially shows loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for providers to load
    await waitFor(() => {
      expect(screen.getByText('Provider 1')).toBeInTheDocument();
      expect(screen.getByText('Provider 2')).toBeInTheDocument();
    });
  });
  
  it('handles errors properly', async () => {
    // Mock the API error
    (fetchProviders as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    renderWithClient(<ProviderList />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });
});
```

## Troubleshooting

### Common Migration Issues

1. **QueryKey Consistency**: Ensure you're using the same query key structure across your application.

   ```typescript
   // Incorrect: inconsistent structure
   useQuery({ queryKey: ['providers', providerId] })
   useQuery({ queryKey: ['provider', providerId] })
   
   // Correct: use consistent queryKeys from queryKeys.ts
   useQuery({ queryKey: queryKeys.provider.detail(providerId) })
   ```

2. **Stale Data**: If data isn't updating as expected, check your staleTime and refetch settings.

   ```typescript
   // Example: Setting a lower staleTime for frequently changing data
   useQuery({
     queryKey: queryKeys.provider.list(),
     queryFn: fetchProviders,
     staleTime: 1000 * 60, // 1 minute (default is 10 minutes in our config)
   });
   ```

3. **Missing Enabled Flag**: For queries that depend on certain conditions, use the enabled option.

   ```typescript
   // Example: Only fetch when providerId is defined
   useQuery({
     queryKey: queryKeys.provider.detail(providerId),
     queryFn: () => fetchProvider(providerId),
     enabled: !!providerId, // Prevents query from running when providerId is undefined
   });
   ```

4. **Hydration Errors**: When using SSR, ensure your server and client query keys match exactly.

   ```typescript
   // Server component
   await queryClient.prefetchQuery({
     queryKey: queryKeys.provider.detail(providerId),
     queryFn: () => fetchProvider(providerId),
   });
   
   // Client component
   useQuery({
     queryKey: queryKeys.provider.detail(providerId), // Must match exactly
     queryFn: () => fetchProvider(providerId),
   });
   ```

5. **Cache Invalidation**: If mutations don't update related queries, check your invalidation logic.

   ```typescript
   // Example: Invalidating multiple related queries
   onSuccess: (data, variables) => {
     // Invalidate the specific item
     queryClient.invalidateQueries({
       queryKey: queryKeys.provider.detail(variables.id),
     });
     
     // Also invalidate the list query to update any lists that contain this item
     queryClient.invalidateQueries({
       queryKey: queryKeys.provider.list(),
     });
   }
   ```

### Advanced Troubleshooting

1. **React Query DevTools**: Enable the DevTools to inspect queries, their states, and cache contents.

   ```tsx
   // Available in development mode via ReactQueryProvider
   <ReactQueryDevtools initialIsOpen={false} />
   ```

2. **Debugging Query Functions**: Add console logs to your query functions to track execution.

   ```typescript
   queryFn: async () => {
     console.log('Fetching providers with params:', params);
     const result = await fetchProviders(params);
     console.log('Fetched result:', result);
     return result;
   }
   ```

3. **Check for Network Issues**: Ensure your API functions are handling network errors properly.

   ```typescript
   async function fetchProvider(id) {
     try {
       const response = await fetch(`/api/providers/${id}`);
       if (!response.ok) {
         throw new Error(`API error: ${response.status} ${response.statusText}`);
       }
       return response.json();
     } catch (error) {
       console.error('Fetch error:', error);
       throw error; // Important: Re-throw the error for TanStack Query to handle
     }
   }
   ```

4. **Authentication Issues**: Ensure your auth token is being passed correctly.

   ```typescript
   queryFn: async () => {
     try {
       const apiClient = await getApiClient();
       const response = await apiClient.get('/protected-endpoint');
       return response.data;
     } catch (error) {
       // Check for auth-related errors
       if (error.response?.status === 401) {
         console.error('Authentication error - token may be invalid');
       }
       throw error;
     }
   }
   ```

### Special Case: Supporting Both Migration Stages

During migration, you might need to support both old and new implementations. Here's a strategy:

```typescript
// hooks/use-legacy-integration.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';

// Flag to control whether to use TanStack Query or the legacy implementation
const USE_REACT_QUERY = true;

export function useProviders(legacyFetchFn) {
  const query = useQuery({
    queryKey: queryKeys.provider.list(),
    queryFn: fetchProviders,
    // Disable if we're using the legacy implementation
    enabled: USE_REACT_QUERY,
  });
  
  // Allow components to continue using the old pattern during migration
  return {
    // TanStack Query properties
    ...query,
    
    // Legacy pattern compatibility
    providers: query.data,
    isLoading: query.isLoading,
    error: query.error,
    
    // Legacy fetch function - only used if USE_REACT_QUERY is false
    fetchProviders: !USE_REACT_QUERY ? legacyFetchFn : undefined,
  };
}
```

## Conclusion

Migrating to TanStack Query is a significant undertaking, but the benefits in terms of code quality, performance, and developer experience are substantial. By following this guide and implementing the patterns demonstrated, you can successfully refactor your codebase to leverage TanStack Query's powerful capabilities.

Remember to:
- Start with simpler, isolated components
- Create reusable hooks for common data fetching operations
- Use consistent query key structures
- Test thoroughly after each migration
- Use the DevTools to debug any issues

As you migrate more components, you'll develop a better understanding of TanStack Query's patterns and be able to implement more advanced features like optimistic updates, dependent queries, and parallel queries.
