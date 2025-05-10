import { getQueryClient } from '@/lib/query/client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReviewsDisplay } from './reviews-display';
import { prefetchUserReviews } from '@/lib/api/reviews/prefetch';
import { getAuthToken } from '@/lib/auth/server';

interface UserReviewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function UserReviewsPage({ searchParams }: UserReviewsPageProps) {
  // Extract and parse providerId from searchParams
  const providerIdParam = searchParams?.providerId;
  const providerId = typeof providerIdParam === 'string' ? parseInt(providerIdParam, 10) : NaN;
  const isValidProviderId = !isNaN(providerId) && providerId > 0;
  
  // Initialize the QueryClient
  const queryClient = getQueryClient();
  
  // Check if the user is authenticated on the server
  const token = await getAuthToken();
  
  // Only prefetch if we have an auth token (user is logged in)
  if (token) {
    try {
      // Prefetch user reviews for faster initial page load
      await prefetchUserReviews(queryClient, isValidProviderId ? providerId : undefined);
    } catch (error) {
      console.error('Error prefetching data:', error);
      // Continue even if prefetch fails - client will handle fetching
    }
  }
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsDisplay providerId={isValidProviderId ? providerId : 0} />
    </HydrationBoundary>
  );
}
