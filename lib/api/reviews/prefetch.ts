import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getUserReviews, getProviderReviews } from './server';

/**
 * Prefetches user reviews and caches them in the QueryClient
 * @param queryClient The query client to cache data in
 * @param providerId Optional provider ID to filter by
 */
export async function prefetchUserReviews(
  queryClient: QueryClient,
  providerId?: number
): Promise<void> {
  try {
    // Fetch user reviews
    const userReviews = await getUserReviews();
    
    // Cache the results
    queryClient.setQueryData(
      queryKeys.reviews.byUser('me'),
      userReviews
    );
    
    // If a providerId was specified, also cache the filtered reviews
    if (providerId && providerId > 0) {
      const filteredReviews = userReviews.filter(
        review => review.providerId === providerId
      );
      
      // We don't need to store this separately in the cache
      // as the client-side filtering will handle it
    }
    
    console.log('Prefetched user reviews on server:', userReviews.length);
  } catch (error) {
    console.error('Failed to prefetch user reviews:', error);
    // Don't throw the error - we'll let the client handle it
  }
}

/**
 * Prefetches provider reviews and caches them in the QueryClient
 * @param queryClient The query client to cache data in
 * @param providerId The provider ID to fetch reviews for
 */
export async function prefetchProviderReviews(
  queryClient: QueryClient,
  providerId: number
): Promise<void> {
  if (!providerId || providerId <= 0) return;
  
  try {
    // Fetch provider reviews
    const providerReviews = await getProviderReviews(providerId);
    
    // Cache the results
    queryClient.setQueryData(
      queryKeys.reviews.byProvider(providerId),
      providerReviews
    );
    
    console.log('Prefetched provider reviews on server:', providerReviews.length);
  } catch (error) {
    console.error('Failed to prefetch provider reviews:', error);
    // Don't throw the error - we'll let the client handle it
  }
}
