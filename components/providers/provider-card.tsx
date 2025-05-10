'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkX, ExternalLink, Loader2, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ProviderCardProps {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet?: string;
  categories?: Array<string | { id?: number; name: string }>;
  city?: string;
  state?: string;
  onRemoveBookmark?: (providerId: number) => Promise<void>;
  showBookmarkButton?: boolean;
  isRemoving?: boolean;
}

export function ProviderCard({
  id,
  name,
  heroImageUrl,
  aboutSnippet,
  categories = [],
  city,
  state,
  onRemoveBookmark,
  showBookmarkButton = false,
  isRemoving = false,
}: ProviderCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full border-muted-foreground/20 hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/providers/${id}`} className="group">
        <div 
          className="h-40 bg-cover bg-center relative" 
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          <div className={`absolute inset-0 bg-black/10 transition-colors duration-200 ${isHovering ? 'bg-black/25' : ''}`}></div>
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={`text-xl line-clamp-1 transition-colors duration-200 ${isHovering ? 'text-primary' : ''}`}>
            <Link href={`/providers/${id}`} className="hover:underline">
              {name}
            </Link>
          </CardTitle>
          {showBookmarkButton && onRemoveBookmark && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveBookmark(id)}
              title="Remove from saved"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookmarkX className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        {city && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>
              {[city, state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {aboutSnippet || 'No description available'}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {categories?.slice(0, 3).map((category, index) => (
            <Badge 
              key={typeof category === 'object' ? category.id || index : index} 
              variant="outline" 
              className="text-xs"
            >
              {typeof category === 'object' ? category.name : category}
            </Badge>
          ))}
          {(categories?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
              +{(categories?.length || 0) - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/providers/${id}`}>
              <Star className="h-3.5 w-3.5 mr-1" />
              Review
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/providers/${id}`}>
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
