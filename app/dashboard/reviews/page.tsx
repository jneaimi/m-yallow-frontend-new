import { getQueryClient } from '@/lib/query/client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReviewsDisplay } from './reviews-display';

interface UserReviewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function UserReviewsPage({ searchParams }: UserReviewsPageProps) {
  // Extract and parse providerId from searchParams
  const providerIdParam = searchParams?.providerId;
  const providerId = typeof providerIdParam === 'string' ? parseInt(providerIdParam, 10) : NaN;
  const isValidProviderId = !isNaN(providerId) && providerId > 0;
  
  // Initialize the QueryClient but don't prefetch any data
  // (we'll let the client-side hooks handle the authenticated data fetching)
  const queryClient = getQueryClient();
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsDisplay providerId={isValidProviderId ? providerId : 0} />
    </HydrationBoundary>
  );
}
