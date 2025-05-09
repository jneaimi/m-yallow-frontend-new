'use client';

import { useRecentProviders } from '@/hooks/providers/use-recent-providers';
import { ProvidersGrid } from '@/components/providers/providers-grid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentProvidersClientProps {
  limit?: number;
}

export function RecentProvidersClient({ limit = 6 }: RecentProvidersClientProps) {
  // Use the custom hook to fetch recent providers
  const { 
    data: providers, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching 
  } = useRecentProviders(limit);

  // Handle loading state (should be handled by Suspense in the server component)
  if (isLoading) {
    return <div className="text-center py-12">Loading recent providers...</div>;
  }

  // Handle error state
  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription className="flex items-center justify-between">
          <span>Something went wrong while loading recent providers.</span>
          {/* eslint-disable-next-line no-console */}
          {process.env.NODE_ENV !== 'production' && console.error(error)}
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isFetching}
            onClick={() => refetch()} 
            className="ml-4"
          >
            <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Handle empty state
  if (!providers || providers.length === 0) {
    return <div className="text-center py-12">No recent providers found.</div>;
  }

  // Render the providers grid
  return <ProvidersGrid providers={providers} />;
}
