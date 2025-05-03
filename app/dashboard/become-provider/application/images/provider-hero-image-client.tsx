'use client';

import { useState } from 'react';
import { ProviderHeroImage } from '@/components/providers/provider-hero-image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProviderHeroImageClientProps {
  providerId: string;
  existingImageUrl?: string;
}

export function ProviderHeroImageClient({
  providerId,
  existingImageUrl,
}: ProviderHeroImageClientProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(existingImageUrl);
  const router = useRouter();
  
  const handleImageUpdated = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
    
    // Show success message
    toast.success('Hero image updated', {
      description: 'Your provider profile hero image has been updated successfully.',
    });
    
    // Refresh the page to ensure all components are updated
    router.refresh();
  };
  
  return (
    <ProviderHeroImage
      providerId={providerId}
      existingImageUrl={imageUrl}
      onImageUpdated={handleImageUpdated}
    />
  );
}