"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { getFallbackImageUrl } from "@/lib/image-utils";
import { Category } from "@/lib/api/providers";
import { ProviderLocationMap } from "@/components/maps/provider-location-map";
import { ProviderLocationDetails } from "@/components/providers/provider-location-details";
import { ProviderSchemaMarkup } from "@/components/providers/provider-schema-markup";
import { ProviderContactForm } from "@/components/providers/provider-contact-form";
import { MapPin, Mail, Calendar, Star, ChevronLeft } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { toast } from "sonner";

interface ProviderDetailClientProps {
  provider: {
    id: number;
    name: string;
    contact: string;
    location: string;
    about: string;
    heroImageUrl: string;
    createdAt: string;
    categories?: Category[];
    // Address components
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    // Geographic coordinates
    latitude?: number;
    longitude?: number;
  };
}

export function ProviderDetailClient({ provider }: ProviderDetailClientProps) {
  const [imgError, setImgError] = React.useState(false);
  const imageUrl =
    !provider.heroImageUrl || imgError
      ? getFallbackImageUrl()
      : provider.heroImageUrl;
  const createdDate = new Date(provider.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { isSignedIn } = useAuth();
  const { isBookmarked, bookmarks } = useBookmarks();
  
  // Check if this provider is bookmarked by the current user
  const providerIsBookmarked = isBookmarked(provider.id);
  
  // State to keep track of the bookmark status locally
  const [isCurrentlyBookmarked, setIsCurrentlyBookmarked] = useState(providerIsBookmarked);
  
  // Update local state when the bookmarks change
  useEffect(() => {
    setIsCurrentlyBookmarked(isBookmarked(provider.id));
  }, [bookmarks, isBookmarked, provider.id]);
  
  const handleBookmarkToggle = (newBookmarkState: boolean) => {
    setIsCurrentlyBookmarked(newBookmarkState);
  };

  // Compile full address for map display
  const fullAddress =
    provider.location ||
    [
      provider.street,
      provider.city,
      provider.state,
      provider.postalCode,
      provider.country,
    ]
      .filter(Boolean)
      .join(", ");

  // Check if we have map-worthy data
  const hasValidCoords =
    typeof provider.latitude === "number" &&
    typeof provider.longitude === "number";
  const hasMapData = hasValidCoords || Boolean(fullAddress);

  const handleReviewSubmitted = () => {
    toast.success('Your review has been submitted and is awaiting approval.');
  };

  return (
    <div className="py-8 md:py-12">
      {/* SEO Schema Markup */}
      <ProviderSchemaMarkup provider={provider} />
      <ResponsiveContainer maxWidth="xl">
        {/* Back button and bookmark button */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" asChild>
            <Link href="/providers/search" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to all providers
            </Link>
          </Button>
          
          {isSignedIn && (
            <BookmarkButton
              providerId={provider.id}
              initialIsBookmarked={isCurrentlyBookmarked}
              onToggle={handleBookmarkToggle}
            />
          )}
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

        {/* Provider header */}
        <div className="mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {provider.name || "Unnamed Provider"}
              </h1>

              {/* Location summary */}
              {fullAddress && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <p className="truncate max-w-lg">{fullAddress}</p>
                </div>
              )}
            </div>
            
            {/* If user is not signed in, show sign-in prompt for bookmarking */}
            {!isSignedIn && (
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">
                  Sign in to save
                </Link>
              </Button>
            )}
          </div>

          {/* Categories */}
          {provider.categories && provider.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {provider.categories.map((category) => (
                <Badge key={category.id} className="px-3 py-1">
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left column - Provider details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                {hasMapData && (
                  <TabsTrigger value="location">Location</TabsTrigger>
                )}
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-0">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-3">
                    About {provider.name}
                  </h2>
                  <div className="text-base leading-relaxed whitespace-pre-line">
                    {provider.about ||
                      "No information provided about this service provider."}
                  </div>
                </Card>
              </TabsContent>

              {hasMapData && (
                <TabsContent value="location" className="mt-0">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Location</h2>
                    <ProviderLocationDetails
                      street={provider.street}
                      city={provider.city}
                      state={provider.state}
                      postalCode={provider.postalCode}
                      country={provider.country}
                      location={provider.location}
                    />

                    <div className="mt-6">
                      <ProviderLocationMap
                        latitude={provider.latitude}
                        longitude={provider.longitude}
                        providerName={provider.name}
                        address={fullAddress}
                      />
                    </div>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="reviews" className="mt-0 space-y-6">
                {/* Leave a review section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leave a Review</CardTitle>
                    <CardDescription>
                      Share your experience with {provider.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSignedIn ? (
                      <ReviewForm 
                        providerId={provider.id} 
                        onSuccess={handleReviewSubmitted}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          Please sign in to leave a review
                        </p>
                        <Button asChild>
                          <Link href="/sign-in">Sign In</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Reviews list section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-primary" /> 
                      Reviews
                    </CardTitle>
                    <CardDescription>
                      See what others have said about {provider.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewList providerId={provider.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Contact sidebar */}
          <div className="bg-muted/30 p-6 rounded-xl h-fit">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              {provider.contact && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{provider.contact}</p>
                  </div>
                </div>
              )}

              {fullAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <ProviderLocationDetails
                      street={provider.street}
                      city={provider.city}
                      state={provider.state}
                      postalCode={provider.postalCode}
                      country={provider.country}
                      location={provider.location}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Member since</p>
                  <p className="text-sm">
                    {provider.createdAt ? createdDate : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />
            
            {/* Actions section */}
            <div className="mb-6">
              {isSignedIn ? (
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  asChild
                >
                  <Link href={`/dashboard/reviews?providerId=${provider.id}`}>
                    Your Reviews
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  asChild
                >
                  <Link href="/sign-in">
                    Sign in to save or review
                  </Link>
                </Button>
              )}
            </div>

            {/* Contact action */}
            <div className="pt-6 border-t">
              <h3 className="font-medium mb-3">Contact {provider.name}</h3>
              <ProviderContactForm
                providerName={provider.name}
                providerId={provider.id}
                providerEmail={provider.contact}
              />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
