'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';

export function useProviderReviews(providerId: number) {
  const reviewClient = useReviewClient();
  
  return useQuery({
    queryKey: queryKeys.reviews.byProvider(providerId),
    queryFn: () => reviewClient.getProviderReviews(providerId),
    enabled: !!providerId && providerId > 0,
  });
}
