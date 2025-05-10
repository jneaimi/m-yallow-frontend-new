# Provider Dashboard TanStack Query Refactoring

This document outlines the process of refactoring the Provider Dashboard to use TanStack Query. It includes the problems with the previous implementation, the refactoring strategy, implementation details, and the benefits of the new approach.

## Table of Contents

1. [Previous Implementation](#previous-implementation)
2. [Problems with the Previous Implementation](#problems-with-the-previous-implementation)
3. [Refactoring Strategy](#refactoring-strategy)
4. [Implementation Details](#implementation-details)
5. [Benefits](#benefits)
6. [Key Takeaways](#key-takeaways)

## Previous Implementation

The Provider Dashboard previously used React Context API with useState and useEffect for state management and data fetching:

```tsx
// Provider Context (lib/context/provider-context.tsx)
export function ProviderProvider({ children }: { children: ReactNode }) {
  const [providerData, setProviderData] = useState<ApiProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  const fetchProviderStatus = async () => {
    if (!isSignedIn) {
      setIsLoading(false);
      setProviderData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiClient = await getApiClient();
      const response = await apiClient.get('/providers/me');
      setProviderData(response.data);
    } catch (err: any) {
      // 404 means the user is not a provider yet, which is not an error
      if (err.response && err.response.status === 404) {
        setProviderData(null);
      } else {
        console.error('Error fetching provider status:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch provider status'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, [isSignedIn]);

  // ...
}
```

The dashboard client component used this context and had all UI logic in a single large component:

```tsx
// Dashboard Client (app/dashboard/provider/provider-dashboard-client.tsx)
export function ProviderDashboardClient() {
  const { isProvider, isApproved, providerData, isLoading } = useProvider();
  const router = useRouter();
  
  // Redirect if not a provider or not approved
  useEffect(() => {
    if (!isLoading && (!isProvider || !isApproved)) {
      router.push('/dashboard');
    }
  }, [isProvider, isApproved, isLoading, router]);

  // Simulated metrics data
  const metrics = {
    views: 128,
    viewsChange: 12,
    inquiries: 7,
    // ...more hardcoded data
  };

  // Simulated inquiries data
  const recentInquiries = [
    { id: '1', name: 'John Smith', ... },
    // ...more hardcoded data
  ];

  // UI rendering with all sections in one component
  return (
    <AuthWrapper>
      <DashboardLayout>
        {/* All dashboard sections in one component */}
      </DashboardLayout>
    </AuthWrapper>
  );
}
```

## Problems with the Previous Implementation

The previous implementation had several issues:

1. **State Management**: Using React Context and useState for state management:
   - No automatic caching or de-duplication of requests
   - Required manual refreshing of data
   - No background refetching capabilities

2. **Data Fetching**:
   - Only fetched basic provider data
   - Used hardcoded/simulated data for metrics, inquiries, and reviews
   - No real API integration for dashboard sections

3. **Error Handling**:
   - Basic error handling without retry mechanisms
   - No consistent error handling strategy

4. **Component Structure**:
   - All functionality in a single large component
   - No separation between data fetching and presentation

5. **Maintainability**:
   - Difficult to add new features or modify existing ones
   - Hard to test individual parts of the dashboard

## Refactoring Strategy

The refactoring strategy focused on:

1. **Using TanStack Query**: Replace React Context with TanStack Query for automatic caching, background refetching, and improved error handling.

2. **Modular Architecture**: Break down the monolithic component into smaller, more focused components with clear responsibilities.

3. **Custom Hooks**: Create specialized hooks for different data requirements that can be composed together.

4. **Error Handling**: Implement consistent error handling with fallbacks for API endpoints that might not be available yet.

5. **Loading States**: Add proper loading states for each component to improve user experience.

## Implementation Details

### 1. Query Key Structure

We extended the existing query keys for provider dashboard-related queries:

```typescript
// lib/query/keys.ts
export const queryKeys = {
  // ...existing keys
  provider: {
    all: ['provider'] as const,
    // ...existing provider keys
    
    // Dashboard-related queries
    me: () => [...queryKeys.provider.all, 'me'] as const,
    metrics: () => [...queryKeys.provider.all, 'metrics'] as const,
    inquiries: (limit?: number) => [...queryKeys.provider.all, 'inquiries', limit] as const,
    services: () => [...queryKeys.provider.all, 'services'] as const,
  },
}
```

### 2. Custom Hooks

We created five specialized hooks for different data requirements:

#### Provider Profile Hook

```typescript
// hooks/providers/use-provider-me.ts
export function useProviderMe() {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  return useQuery<ApiProvider | null>({
    queryKey: queryKeys.provider.me(),
    queryFn: async () => {
      if (!isSignedIn) return null;
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get('/providers/me');
        return response.data;
      } catch (err: any) {
        // 404 means the user is not a provider yet, which is not an error
        if (err.response && err.response.status === 404) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!isSignedIn,
  });
}
```

#### Provider Metrics Hook

```typescript
// hooks/providers/use-provider-metrics.ts
export function useProviderMetrics() {
  const getApiClient = useApiClient();
  const { isSignedIn } = useAuth();

  return useQuery<ProviderMetrics>({
    queryKey: queryKeys.provider.metrics(),
    queryFn: async () => {
      if (!isSignedIn) {
        throw new Error('User is not signed in');
      }
      
      try {
        const apiClient = await getApiClient();
        const response = await apiClient.get('/providers/me/metrics');
        return response.data;
      } catch (err) {
        // If the API doesn't support metrics yet, return mock data
        console.warn('Error fetching provider metrics, using sample data:', err);
        
        // Return sample data for now
        return {
          views: 128,
          viewsChange: 12,
          // ...mock data
        };
      }
    },
    enabled: !!isSignedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

Similar hooks were created for `useProviderInquiries`, `useProviderReviews`, and `useProviderServices`.

### 3. Modular Component Structure

We broke down the monolithic component into smaller, focused components:

#### Main Dashboard Client Component

```tsx
// app/dashboard/provider/provider-dashboard-client.tsx
export function ProviderDashboardClient() {
  const { data: providerData, isLoading } = useProviderMe();
  const router = useRouter();
  
  const isProvider = !!providerData;
  const isApproved = providerData?.approved || false;
  
  // Redirect if not a provider or not approved
  useEffect(() => {
    if (!isLoading && (!isProvider || !isApproved)) {
      router.push('/dashboard');
    }
  }, [isProvider, isApproved, isLoading, router]);

  return (
    <AuthWrapper loadingText="Loading your provider dashboard...">
      <DashboardLayout>
        <div className="space-y-6">
          <DashboardHeader
            title="Provider Dashboard"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Provider Dashboard', href: '/dashboard/provider' }
            ]}
            actions={[
              { 
                label: 'Provider Settings',
                icon: 'Settings', 
                href: '/dashboard/provider/settings',
                variant: 'outline'
              },
              { 
                label: 'Edit Profile',
                icon: 'Edit', 
                href: '/dashboard/provider/profile'
              }
            ]}
          />
          
          {/* Provider Profile Card */}
          <ProviderProfileCard />
          
          {/* Metrics Section */}
          <ProviderMetricsSection />
          
          {/* Tabs for different sections */}
          <ProviderTabs />
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
```

Each section was then implemented as its own component with its own data fetching using the custom hooks, for example:

#### Provider Profile Card

```tsx
// components/dashboard/provider/ProviderProfileCard.tsx
export function ProviderProfileCard() {
  const { data: providerData, isLoading } = useProviderMe();
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 animate-pulse">
            {/* Loading skeleton UI */}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Profile</CardTitle>
        <CardDescription>Your profile information as seen by potential clients</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Profile content */}
      </CardContent>
      {/* ... */}
    </Card>
  );
}
```

### 4. SSR Integration

We updated the page component to use TanStack Query's HydrationBoundary:

```tsx
// app/dashboard/provider/page.tsx
export default async function ProviderDashboardPage() {
  const queryClient = getQueryClient();
  
  // Note: Server-side prefetching would be done here if needed
  // For authenticated routes, we typically do client-side fetching
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProviderDashboardClient />
    </HydrationBoundary>
  );
}
```

## Benefits

The refactoring provides several key benefits:

1. **Improved Data Management**:
   - Automatic caching and background refetching
   - Deduplication of requests
   - Consistent loading and error states

2. **Better User Experience**:
   - Loading skeletons for each component
   - Components load independently
   - Fallbacks for missing data

3. **Enhanced Maintainability**:
   - Clear separation of concerns
   - Each component has a well-defined responsibility
   - Easier to add new features or modify existing ones

4. **Future-proof Architecture**:
   - Easy to add real API endpoints when they become available
   - Consistent pattern across the application
   - Better testability

5. **Improved Performance**:
   - Components can render independently
   - Only re-render components when their data changes
   - Cached data reduces unnecessary network requests

## Key Takeaways

1. **Modular Data Fetching**: Using specialized hooks for different data requirements provides a clear separation of concerns and makes the code more maintainable.

2. **Graceful Degradation**: Implementing fallbacks for API endpoints that might not be available yet allows for incremental development.

3. **Component-Level Loading States**: Having each component handle its own loading state improves the user experience by providing more granular feedback.

4. **Error Handling Strategy**: Using a consistent error handling approach with appropriate fallbacks enhances resilience.

5. **Composable Architecture**: Breaking down the UI into focused components makes the code more maintainable and easier to test.

This refactoring serves as a pattern for other dashboard-like features in the application, providing a template for implementing TanStack Query in complex, data-heavy UIs with multiple data dependencies.
