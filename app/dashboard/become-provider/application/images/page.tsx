import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getProviderHeroImageUrl, getFallbackImageUrl } from '@/lib/image-utils';
import { ProviderHeroImageClient } from './provider-hero-image-client';

export default async function ProviderImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ providerId?: string }>
}) {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  const params = await searchParams;
  const providerId = params.providerId;
  
  if (!providerId) {
    redirect('/dashboard/become-provider/application');
  }
  
  // Validate providerId format (assuming it should be numeric)
  if (!/^\d+$/.test(providerId)) {
    redirect('/dashboard/become-provider/application');
  }
  
  // Construct the existing hero image URL if any, using fallback as null to avoid 404 errors
  // This will let the component handle displaying the upload UI instead of a broken image
  const fallbackUrl = null; // Don't use fallback here to avoid unnecessary 404 errors
  const existingImageUrl = getProviderHeroImageUrl(providerId);
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard/become-provider/application">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Add Images to Your Provider Profile</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground">
          Upload a high-quality hero image to make your provider profile stand out.
          This image will be displayed at the top of your profile and in search results.
        </p>
      </div>
      
      <div className="grid gap-8 max-w-3xl mx-auto">
        {/* Hero Image Upload Component */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Hero Image</h2>
          <ProviderHeroImageClient 
            providerId={providerId} 
            existingImageUrl={existingImageUrl}
          />
        </div>
        
        {/* Continue Button */}
        <div className="flex justify-end mt-6">
          <Button asChild>
            <Link href={`/dashboard/become-provider/application/categories?providerId=${providerId}`}>
              Continue to Categories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}