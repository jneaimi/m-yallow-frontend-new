"use client";

import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveGrid } from "@/components/ui/responsive";
import { Category } from "@/lib/api/providers";

interface Provider {
  id: number;
  name: string;
  heroImageUrl: string;
  aboutSnippet: string;
  categories?: Category[];
}

interface ProvidersGridProps {
  providers: Provider[];
}

export function ProvidersGrid({ providers }: ProvidersGridProps) {
  return (
    <ResponsiveGrid cols={1} smCols={2} lgCols={3} gap="6">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          id={provider.id}
          name={provider.name}
          heroImageUrl={provider.heroImageUrl}
          aboutSnippet={provider.aboutSnippet}
          categories={provider.categories}
        />
      ))}
    </ResponsiveGrid>
  );
}
