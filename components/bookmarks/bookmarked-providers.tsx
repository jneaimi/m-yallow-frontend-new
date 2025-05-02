'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkX, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createApiClient } from '@/lib/api-client';
import { PROVIDER_API, ApiProvider } from '@/lib/api/providers';
import { toast } from 'sonner';
import { ProviderCard } from '@/components/providers/provider-card';

export function BookmarkedProviders() {
  const { bookmarks, isLoading: isLoadingBookmarks, toggleBookmark } = useBookmarks();
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingBookmarkIds, setRemovingBookmarkIds] = useState<number[]>([]);

  // Function to handle removing a bookmark directly from this view
  const handleRemoveBookmark = async (providerId: number) => {
    try {
      setRemovingBookmarkIds(prev => [...prev, providerId]);
      await toggleBookmark(providerId);
      // Provider will be removed from the list due to the useEffect dependency on bookmarks
      toast.success("Provider removed from your saved list");
    } catch (error) {
      toast.error("Failed to remove provider from saved list");
    } finally {
      setRemovingBookmarkIds(prev => prev.filter(id => id !== providerId));
    }
  };

  useEffect(() => {
    async function fetchProviders() {
      if (bookmarks.length === 0) {
        setProviders([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const apiClient = await createApiClient();
        // Fetch details for each bookmarked provider
        const providerPromises = bookmarks.map(id => 
          apiClient.get(PROVIDER_API.DETAIL(id))
            .then(response => response.data)
            .catch(error => {
              console.error(`Failed to fetch provider ${id}:`, error);
              return null;
            })
        );
        
        const results = await Promise.all(providerPromises);
        setProviders(results.filter(Boolean)); // Filter out any failed requests
      } catch (error) {
        console.error('Failed to fetch bookmarked providers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProviders();
  }, [bookmarks]);

  if (isLoadingBookmarks || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-medium">Loading your saved providers</h3>
        <p className="text-muted-foreground text-sm mt-2">This will just take a moment...</p>
      </div>
    );
  }

  if (bookmarks.length === 0 || providers.length === 0) {
    return (
      <Card className="bg-muted/20 border-dashed border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <BookmarkX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No saved providers yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            When you find providers you'd like to remember, click the "Save" button to add them to your collection.
          </p>
          <Button asChild>
            <Link href="/providers">
              Browse Providers
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // This is now handled by the component state declaration above

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {providers.map(provider => {
        // Extract necessary properties to match updated ProviderCard props
        const heroImageUrl = provider.hero_image_url || `/images/placeholder-provider.jpg`;
        
        return (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name || 'Unnamed Provider'}
            heroImageUrl={heroImageUrl}
            aboutSnippet={provider.about}
            categories={provider.categories || []}
            city={provider.city}
            state={provider.state}
            onRemoveBookmark={handleRemoveBookmark}
            showBookmarkButton={true}
            isRemoving={removingBookmarkIds.includes(provider.id)}
          />
        );
      })}
    </div>
  );
}
