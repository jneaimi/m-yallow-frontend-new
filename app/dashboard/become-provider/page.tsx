import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BecomeProviderPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Become a Provider</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground">
          Join our network of service providers and reach new customers.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Why become a provider?</CardTitle>
            <CardDescription>Benefits of listing your services</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-primary">✓</span>
                <span>Increase your visibility to potential clients</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-primary">✓</span>
                <span>Build your online reputation through reviews</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-primary">✓</span>
                <span>Connect with customers looking specifically for your services</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-primary">✓</span>
                <span>Free to join and easy to get started</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>Simple steps to list your services</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 list-decimal ml-5">
              <li>
                <span className="font-medium">Complete your provider profile</span>
                <p className="text-sm text-muted-foreground">
                  Add your business details, services, and contact information.
                </p>
              </li>
              <li>
                <span className="font-medium">Submit for review</span>
                <p className="text-sm text-muted-foreground">
                  Our team will review your listing to ensure quality.
                </p>
              </li>
              <li>
                <span className="font-medium">Get discovered</span>
                <p className="text-sm text-muted-foreground">
                  Once approved, users can find and contact you.
                </p>
              </li>
              <li>
                <span className="font-medium">Grow your business</span>
                <p className="text-sm text-muted-foreground">
                  Build your reputation through reviews and connect with clients.
                </p>
              </li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/dashboard/become-provider/application">
                Start Your Provider Application
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-10">
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions about becoming a provider, please contact our support team at{' '}
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
