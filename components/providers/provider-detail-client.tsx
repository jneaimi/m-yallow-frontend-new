"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFallbackImageUrl } from "@/lib/image-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/lib/api/providers";
import { ProviderLocationMap } from "@/components/maps/provider-location-map";
import { ProviderLocationDetails } from "@/components/providers/provider-location-details";
import { ProviderSchemaMarkup } from "@/components/providers/provider-schema-markup";
import { ProviderContactForm } from "@/components/providers/provider-contact-form";
import { MapPin, Mail, Calendar, Phone } from "lucide-react";

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
  const imageUrl = (!provider.heroImageUrl || imgError) ? getFallbackImageUrl() : provider.heroImageUrl;
  const createdDate = new Date(provider.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Compile full address for map display
  const fullAddress = provider.location || 
    [provider.street, provider.city, provider.state, provider.postalCode, provider.country]
      .filter(Boolean)
      .join(", ");

  // Check if we have map-worthy data
  const hasMapData = (provider.latitude && provider.longitude) || fullAddress;

  return (
    <div className="py-8 md:py-12">
      {/* SEO Schema Markup */}
      <ProviderSchemaMarkup provider={provider} />
      <ResponsiveContainer maxWidth="xl">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/providers/search" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to all providers
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
        
        {/* Provider header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{provider.name || 'Unnamed Provider'}</h1>
          
          {/* Location summary */}
          {fullAddress && (
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <p className="truncate max-w-lg">{fullAddress}</p>
            </div>
          )}
          
          {/* Categories */}
          {provider.categories && provider.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {provider.categories.map(category => (
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
                {hasMapData && <TabsTrigger value="location">Location</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-3">About {provider.name}</h2>
                  <div className="text-base leading-relaxed whitespace-pre-line">
                    {provider.about || 'No information provided about this service provider.'}
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
                  <p className="text-sm">{provider.createdAt ? createdDate : 'Unknown'}</p>
                </div>
              </div>
            </div>
            
            {/* Contact action */}
            <div className="mt-6 pt-6 border-t">
              <ProviderContactForm 
                providerName={provider.name} 
                providerEmail={provider.contact} 
              />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
