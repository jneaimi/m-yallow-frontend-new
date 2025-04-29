"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFallbackImageUrl } from "@/lib/image-utils";
import { Category } from "@/lib/api/providers";

interface ProviderCardProps {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet: string;
  categories?: Category[];
}

export function ProviderCard({ 
  id, 
  name, 
  heroImageUrl, 
  aboutSnippet,
  categories = []
}: ProviderCardProps) {
  const [imgError, setImgError] = useState(false);
  
  // Use fallback image if heroImageUrl is null or if there's an error loading the image
  const imageUrl = (!heroImageUrl || imgError) ? getFallbackImageUrl() : heroImageUrl;
  
  return (
    <Link href={`/providers/${id}`} className="block h-full transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${name} hero image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3 mb-4">{aboutSnippet}</p>
          
          {/* Display categories if available */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(category => (
                <Badge key={category.id} variant="outline" className="text-xs">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <span className="text-sm text-primary">View details</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
