import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BookmarksDisplay } from './bookmarks-display';

export default async function BookmarksPage() {
  // Get the current user
  const user = await currentUser();
  
  // Redirect to sign-in if no user is authenticated
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
      
      <h1 className="text-3xl font-bold mb-6">Saved Providers</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground mb-4">
          Manage the providers you've saved for quick reference.
        </p>
        <div className="bg-muted/50 p-4 rounded-md text-sm">
          <p>
            <strong>Pro Tip:</strong> You can save providers by clicking the "Save" button on a provider's page.
            This makes it easier to find providers you're interested in later.
          </p>
        </div>
      </div>
      
      {/* Use the client-side component for managing bookmarks */}
      <BookmarksDisplay />
    </div>
  );
}
