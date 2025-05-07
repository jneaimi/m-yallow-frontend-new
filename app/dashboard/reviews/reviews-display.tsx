'use client';

import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { ReviewList } from '@/components/reviews/review-list';
import { ChevronLeft, Star, ChevronRight } from 'lucide-react';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ReviewsDisplayProps {
  providerId: number; // Receive the parsed providerId
}

export function ReviewsDisplay({ providerId }: ReviewsDisplayProps) {
  // Title and description based on providerId
  const pageTitle = providerId ? `My Reviews for Provider #${providerId}` : 'My Reviews';
  const pageDescription = providerId 
    ? `Viewing your reviews for this specific provider, including pending reviews.`
    : `Here you can view, edit, or delete all reviews you've submitted across all providers.`;

  return (
    <AuthWrapper loadingText="Loading your reviews...">
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
                <Link href="/dashboard/reviews" className="hover:text-foreground">
                  My Reviews
                </Link>
                {providerId > 0 && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <span className="font-medium text-foreground">
                      Provider #{providerId}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl font-bold mt-2">{pageTitle}</h1>
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/search">
                Find Providers to Review
              </Link>
            </Button>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md text-sm flex items-start gap-3">
            <div className="mt-0.5">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p>
                <strong>Note:</strong> When you update a review, it will be submitted for approval again
                before it becomes publicly visible.
              </p>
            </div>
          </div>
          
          {/* In the dashboard context, we always want to show the user's reviews first */}
          <ReviewList 
            providerId={providerId} 
            userReviews={true}
          />
          
          {/* Debug information - can be removed in production */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Debug Info:</p>
              <p>Provider ID: {String(providerId)}</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}