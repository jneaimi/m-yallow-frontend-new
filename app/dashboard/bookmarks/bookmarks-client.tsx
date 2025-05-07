'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, Bookmark, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { BookmarkedProviders } from '@/components/bookmarks/bookmarked-providers';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';

export function BookmarksClient() {
  return (
    <AuthWrapper loadingText="Loading your saved providers...">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              {/* Simple breadcrumb navigation */}
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-foreground">Saved Providers</span>
              </div>
              <h1 className="text-2xl font-bold mt-2">Saved Providers</h1>
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/search">
                Find New Providers
              </Link>
            </Button>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md text-sm flex items-start gap-3">
            <div className="mt-0.5">
              <Bookmark className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p>
                <strong>Pro Tip:</strong> You can save providers by clicking the "Save" button on a provider's page.
                This makes it easier to find providers you're interested in later.
              </p>
            </div>
          </div>
          
          {/* Use the BookmarkedProviders component which will handle fetching the bookmarks */}
          <BookmarkedProviders />
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}