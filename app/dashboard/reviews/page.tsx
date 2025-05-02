// Remove async, currentUser, redirect, headers imports
import { ReviewList } from '@/components/reviews/review-list'; // Keep this if ReviewsDisplay uses it directly, otherwise remove
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ReviewsDisplay } from './reviews-display'; // Import the new client component

// No longer need 'force-dynamic' here if client component handles dynamic data fetching
// export const dynamic = 'force-dynamic'; 

// Define props to accept searchParams
interface UserReviewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Make the component async to properly await searchParams
export default async function UserReviewsPage({ searchParams }: UserReviewsPageProps) {
  // Wait for searchParams before accessing properties
  const resolvedParams = await searchParams;
  
  // Extract and parse providerId from searchParams
  const providerIdParam = resolvedParams?.providerId;
  const providerId = typeof providerIdParam === 'string' ? parseInt(providerIdParam, 10) : NaN;
  const isValidProviderId = !isNaN(providerId) && providerId > 0;

  // Determine title/description based on params (can still be done server-side)
  const pageTitle = isValidProviderId ? `My Reviews for Provider #${providerId}` : 'My Reviews';
  const pageDescription = isValidProviderId 
    ? `Viewing your reviews for this specific provider, including pending reviews.`
    : `Here you can view, edit, or delete all reviews you've submitted across all providers.`;

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
      
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground mb-4">
          {pageDescription}
        </p>
        <div className="bg-muted/50 p-4 rounded-md text-sm">
          <p>
            <strong>Note:</strong> When you update a review, it will be submitted for approval again
            before it becomes publicly visible.
          </p>
        </div>
      </div>
      
      {/* Render the Client Component, passing the parsed providerId */}
      <ReviewsDisplay providerId={isValidProviderId ? providerId : 0} />
      
      {/* Debug information */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Debug Info:</p>
        <p>Provider ID Param: {String(providerIdParam)}</p>
        <p>Parsed Provider ID: {String(providerId)}</p>
        <p>Is Valid Provider ID: {String(isValidProviderId)}</p>
      </div>
    </div>
  );
}
