'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { useReviewClient } from '@/lib/api/reviews/client';
import { Review } from '@/lib/api/reviews';

export function useProviderReviews(
  providerId: number, 
  options?: Partial<UseQueryOptions<Review[]>>
) {
  const reviewClient = useReviewClient();
  
  return useQuery<Review[]>({
    queryKey: queryKeys.reviews.byProvider(providerId),
    queryFn: () => reviewClient.getProviderReviews(providerId),
    enabled: (!!providerId && providerId > 0) && (options?.enabled !== false),
    ...options,
  });
}
