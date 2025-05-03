import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProviderImagesPage({
  searchParams,
}: {
  searchParams: { providerId?: string }
}) {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  const providerId = searchParams.providerId;
  
  if (!providerId) {
    redirect('/dashboard/become-provider/application');
  }
  
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
          This is a placeholder for the image upload page. Provider ID: {providerId}
        </p>
      </div>
      
      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>
              Add photos to showcase your business or services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Image upload functionality will be implemented in a future task.</p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}