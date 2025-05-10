'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkX, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ProviderCard } from '@/components/providers/provider-card';
import { useBookmarkedProviders, useToggleBookmark } from '@/hooks/bookmarks';

export function BookmarkedProviders() {
  const { data: providers = [], isLoading, error } = useBookmarkedProviders();
  const toggleBookmarkMutation = useToggleBookmark();

  // Function to handle removing a bookmark directly from this view
  const handleRemoveBookmark = async (providerId: number) => {
    try {
      await toggleBookmarkMutation.mutateAsync(providerId);
    } catch (error) {
      // Error is handled in the mutation hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-medium">Loading your saved providers</h3>
        <p className="text-muted-foreground text-sm mt-2">This will just take a moment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-dashed border-destructive">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium mb-2">Error loading bookmarks</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn't load your saved providers. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (providers.length === 0) {
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
            isRemoving={toggleBookmarkMutation.isPending && 
              toggleBookmarkMutation.variables === provider.id}
          />
        );
      })}
    </div>
  );
}
