import { QueryClient } from '@tanstack/react-query';

// Default settings for all queries
const defaultQueryOptions = {
  queries: {
    // Time until the data is considered stale (10 minutes)
    // This prevents unnecessary refetches if data hasn't changed
    staleTime: 10 * 60 * 1000,
    
    // Time in ms that unused/inactive cache data remains in memory (30 minutes)
    gcTime: 30 * 60 * 1000,
    
    // Whether to retry failed queries
    retry: 1,
    
    // Whether to refetch query on window focus
    refetchOnWindowFocus: true,
    
    // Whether to refetch query when the network is reconnected
    refetchOnReconnect: true,
  },
  mutations: {
    // Time in ms that unused/inactive cache data remains in memory (5 minutes)
    gcTime: 5 * 60 * 1000,
  },
};

// Create a client for server-side rendering
export const getServerQueryClient = () => new QueryClient({
  defaultOptions: defaultQueryOptions,
});

// Singleton pattern for client-side to avoid recreating the client on each render
// This prevents memory leaks and unnecessary refetching
let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return getServerQueryClient();
  }
  
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: defaultQueryOptions,
    });
  }
  
  return browserQueryClient;
};
