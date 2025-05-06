import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderCategoriesForm } from './provider-categories-form';

export default async function ProviderCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ providerId?: string }> | { providerId?: string }
}) {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  // Handle both Promise and direct object cases
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const providerId = params.providerId;
  
  if (!providerId) {
    redirect('/dashboard/become-provider/application');
  }
  
  // Validate providerId format (assuming it should be numeric)
  if (!/^\d+$/.test(providerId)) {
    redirect('/dashboard/become-provider/application');
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href={`/dashboard/become-provider/application/images?providerId=${providerId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Images
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Select Your Business Categories</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground">
          Choose the categories that best represent your business or services.
          You can select multiple categories to increase your visibility to potential customers.
        </p>
      </div>
      
      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Business Categories</CardTitle>
            <CardDescription>
              Select the categories that best describe your services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderCategoriesForm providerId={providerId} />
          </CardContent>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Note:</strong> Selecting relevant categories will help potential customers find your business more easily.
          </p>
        </div>
      </div>
    </div>
  );
}