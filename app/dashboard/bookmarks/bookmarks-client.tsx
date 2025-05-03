'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BookmarkedProviders } from '@/components/bookmarks/bookmarked-providers';
import { AuthWrapper } from '@/components/auth/auth-wrapper';

export function BookmarksClient() {
  return (
    <AuthWrapper loadingText="Loading your saved providers...">
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
        
        {/* Use the BookmarkedProviders component which will handle fetching the bookmarks */}
        <BookmarkedProviders />
      </div>
    </AuthWrapper>
  );
}