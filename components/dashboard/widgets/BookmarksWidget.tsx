'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, ArrowRight, MapPin, Star, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This would be replaced with a proper hook to get bookmarks data
function useBookmarksData() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [bookmarks, setBookmarks] = React.useState([]);
  
  React.useEffect(() => {
    // Simulate loading bookmarks data
    const timer = setTimeout(() => {
      setBookmarks([
        {
          id: '1',
          name: 'Blue Sky Therapy',
          category: 'Physical Therapy',
          rating: 4.8,
          reviewCount: 56,
          location: 'Dublin',
          image: '/providers/provider1.jpg',
        },
        {
          id: '2',
          name: 'Mindful Counseling',
          category: 'Mental Health',
          rating: 4.9,
          reviewCount: 32,
          location: 'Cork',
          image: '/providers/provider2.jpg',
        },
        {
          id: '3',
          name: 'Healing Hands Massage',
          category: 'Massage Therapy',
          rating: 4.7,
          reviewCount: 89,
          location: 'Galway',
          image: null,
        },
      ]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return { bookmarks, isLoading };
}

export function BookmarksWidget() {
  const { bookmarks, isLoading } = useBookmarksData();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Bookmark className="mr-2 h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-56" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Bookmark className="mr-2 h-5 w-5" />
          Saved Providers
        </CardTitle>
        <CardDescription>
          {bookmarks.length > 0
            ? `You have ${bookmarks.length} saved providers`
            : "You haven't saved any providers yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((provider) => (
              <div key={provider.id} className="flex items-start gap-3">
                <Avatar className="h-12 w-12 rounded-md">
                  <AvatarImage src={provider.image || ''} alt={provider.name} />
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                    {provider.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-sm truncate">{provider.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {provider.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                      <span>{provider.rating}</span>
                      <span className="ml-1">({provider.reviewCount})</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{provider.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Save providers to quickly access them later
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/search">
                Browse Providers
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      {bookmarks.length > 0 && (
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/bookmarks">
              View all saved providers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
