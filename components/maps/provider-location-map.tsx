"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProviderLocationMapProps {
  latitude?: number;
  longitude?: number;
  providerName: string;
  address?: string;
}

export function ProviderLocationMap({
  latitude,
  longitude,
  providerName,
  address,
}: ProviderLocationMapProps) {
  const [mapUrl, setMapUrl] = useState<string>("");
  const [directionsUrl, setDirectionsUrl] = useState<string>("");
  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";

  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window === 'undefined') return;
    
    if (hasCoordinates) {
      // Google Maps directions URL
      setDirectionsUrl(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      );
      
      // For the static map - check if we have an API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (apiKey) {
        // If we have an API key, use Google's static map API
        setMapUrl(
          `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${apiKey}`
        );
      } else {
        // If no API key, use OpenStreetMap as an alternative
        setMapUrl(
          `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01}%2C${latitude-0.01}%2C${longitude+0.01}%2C${latitude+0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
        );
      }
    } else if (address) {
      // Fallback to address if coordinates are not available
      const encodedAddress = encodeURIComponent(address);
      setDirectionsUrl(
        `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
      );
      
      // For the map, we'll use a placeholder if we don't have coordinates
      setMapUrl("");
    }
  }, [latitude, longitude, address, hasCoordinates]);

  if (!hasCoordinates && !address) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-[2/1] bg-muted">
          {mapUrl ? (
            mapUrl.includes('openstreetmap.org') ? (
              <iframe 
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                title={`Map showing location of ${providerName}`}
              />
            ) : (
              <img
                src={mapUrl}
                alt={`Map showing location of ${providerName}`}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted p-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {hasCoordinates ? 
                  `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}` : 
                  'Map location not available'}
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Location</h3>
          <p className="text-sm text-muted-foreground mb-4">{address || "Map location shown above"}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            asChild
          >
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${providerName}`}
            >
              Get Directions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
