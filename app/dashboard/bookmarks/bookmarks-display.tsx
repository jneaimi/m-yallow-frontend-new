'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BookmarkedProviders } from '@/components/bookmarks/bookmarked-providers';
import { Loader2 } from 'lucide-react';

export function BookmarksDisplay() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If Clerk has loaded but the user is not signed in, redirect
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show a loader while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  // If signed in, render the BookmarkedProviders component
  if (isSignedIn) {
    return <BookmarkedProviders />;
  }

  // If loaded but not signed in (and redirect hasn't happened yet), render null or placeholder
  return null;
}
