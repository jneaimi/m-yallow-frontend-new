"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";
import { getFallbackImageUrl } from "@/lib/image-utils";

interface ProviderDetailClientProps {
  provider: {
    id: number;
    name: string;
    contact: string;
    location: string;
    about: string;
    heroImageUrl: string;
    createdAt: string;
  };
}

export function ProviderDetailClient({ provider }: ProviderDetailClientProps) {
  const [imgError, setImgError] = React.useState(false);
  const imageUrl = (!provider.heroImageUrl || imgError) ? getFallbackImageUrl() : provider.heroImageUrl;
  const createdDate = new Date(provider.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/providers/search" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to providers
            </Link>
          </Button>
        </div>
        {/* Hero image */}
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={imageUrl}
            alt={`${provider.name} hero image`}
            fill
            className="object-cover"
            priority
            onError={() => setImgError(true)}
          />
        </div>
        {/* Provider details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{provider.name}</h1>
            <p className="text-muted-foreground mb-6">{provider.location}</p>
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-base leading-relaxed whitespace-pre-line">{provider.about}</p>
          </div>
          <div className="bg-muted/30 p-6 rounded-xl h-fit">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{provider.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{provider.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p>{createdDate}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full">Contact Provider</Button>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
