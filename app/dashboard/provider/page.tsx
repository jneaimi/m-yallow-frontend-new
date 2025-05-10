import { getQueryClient } from '@/lib/query/client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ProviderDashboardClient } from './provider-dashboard-client';

export default async function ProviderDashboardPage() {
  const queryClient = getQueryClient();
  
  // Note: Server-side prefetching would be done here if needed
  // For authenticated routes, we typically do client-side fetching
  // as the authentication token is only available on the client
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProviderDashboardClient />
    </HydrationBoundary>
  );
}
