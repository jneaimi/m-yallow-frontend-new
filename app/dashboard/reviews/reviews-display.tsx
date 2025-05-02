'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ReviewList } from '@/components/reviews/review-list';
import { Loader2 } from 'lucide-react';

interface ReviewsDisplayProps {
  providerId: number; // Receive the parsed providerId
}

export function ReviewsDisplay({ providerId }: ReviewsDisplayProps) {
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

  // If signed in, render the ReviewList configured for user reviews or provider-specific reviews
  if (isSignedIn) {
    console.log("ReviewsDisplay - Rendering with providerId:", providerId);
    
    // In the dashboard context, we always want to show the user's reviews first
    // This ensures pending reviews are visible as well
    // We're always in the dashboard context in this component
    const showUserReviews = true;
    
    return <ReviewList 
      providerId={providerId} 
      userReviews={showUserReviews}
    />;
  }

  // If loaded but not signed in (and redirect hasn't happened yet), render null or placeholder
  return null; 
}