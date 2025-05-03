import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderProfileForm } from './provider-profile-form';

export default async function ProviderApplicationPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard/become-provider">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Create Your Provider Profile</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground">
          Please provide the following information to create your provider profile. This information will be visible to users searching for services.
        </p>
      </div>
      
      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Provider Information</CardTitle>
            <CardDescription>
              Enter the basic details about your business or services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderProfileForm />
          </CardContent>
        </Card>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Note:</strong> After creating your profile, you'll be prompted to add images and additional details.
          </p>
          <p>
            Your profile will be reviewed by our team before it appears in search results.
          </p>
        </div>
      </div>
    </div>
  );
}