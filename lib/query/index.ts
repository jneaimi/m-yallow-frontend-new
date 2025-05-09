// Re-export the main components and utilities from the query library
export { getQueryClient, getServerQueryClient } from './client';
export { ReactQueryProvider } from './provider';
export { queryKeys } from './keys';

// Also export some commonly used items from TanStack Query for convenience
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
