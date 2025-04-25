"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getFallbackImageUrl } from "@/lib/image-utils";

interface ProviderCardProps {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet: string;
}

export function ProviderCard({ id, name, heroImageUrl, aboutSnippet }: ProviderCardProps) {
  const [imgError, setImgError] = useState(false);
  
  // Use fallback image if heroImageUrl is null or if there's an error loading the image
  const imageUrl = (!heroImageUrl || imgError) ? getFallbackImageUrl() : heroImageUrl;
  
  return (
    <Link href={`/providers/${id}`} className="block h-full transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden">
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
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{aboutSnippet}</p>
        </CardContent>
        <CardFooter>
          <span className="text-sm text-primary">View details</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
