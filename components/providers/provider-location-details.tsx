"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

interface ProviderLocationDetailsProps {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  location?: string;
}

export function ProviderLocationDetails({
  street,
  city,
  state,
  postalCode,
  country,
  location,
}: ProviderLocationDetailsProps) {
  // Determine if we have structured location data
  const hasStructuredLocation = Boolean(
    street || city || state || postalCode || country
  );

  // Format the structured address parts if available
  const formattedAddress = hasStructuredLocation
    ? [
        street,
        [city, state].filter(Boolean).join(", "),
        [postalCode, country].filter(Boolean).join(", "),
      ]
        .filter(Boolean)
        .join("\n")
    : location;

  if (!formattedAddress) {
    return null;
  }

  return (
    <div className="flex items-start gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
      <div className="whitespace-pre-line text-sm">{formattedAddress}</div>
    </div>
  );
}
