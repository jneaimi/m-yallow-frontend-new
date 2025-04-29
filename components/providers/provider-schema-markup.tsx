"use client";

import { Provider } from "@/lib/api/providers";

interface ProviderSchemaMarkupProps {
  provider: Provider;
}

export function ProviderSchemaMarkup({ provider }: ProviderSchemaMarkupProps) {
  // Only generate schema if we have enough provider data
  if (!provider.name) {
    return null;
  }

  // Create the structured data for search engines
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": provider.name,
    "description": provider.about,
    // We don't need the URL for schema markup to be valid
    ...(provider.contact && { "email": provider.contact }),
    ...(provider.latitude && provider.longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": provider.latitude,
        "longitude": provider.longitude
      }
    }),
    ...(provider.street && provider.city && {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": provider.street,
        "addressLocality": provider.city,
        "addressRegion": provider.state,
        "postalCode": provider.postalCode,
        "addressCountry": provider.country
      }
    }),
    ...(provider.categories && provider.categories.length > 0 && {
      "category": provider.categories.map(c => c.name).join(", ")
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
