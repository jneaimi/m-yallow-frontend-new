'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useProviderReviews } from "@/hooks/providers/use-provider-reviews";
import { useProviderMetrics } from "@/hooks/providers/use-provider-metrics";

export function ProviderReviewsTab() {
  const { data: metrics } = useProviderMetrics();
  const { data: reviews, isLoading } = useProviderReviews();
  
  const averageRating = metrics?.averageRating || 0;
  const reviewCount = metrics?.reviewCount || 0;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Reviews</CardTitle>
          <CardDescription>
            Reviews and ratings from your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="h-12 bg-muted rounded w-16 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
            
            <div className="md:w-3/4">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <div className="h-3 bg-muted rounded w-12"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded w-full"></div>
                    </div>
                    <div className="w-12 text-right">
                      <div className="h-3 bg-muted rounded w-8 ml-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Client Reviews</CardTitle>
        <CardDescription>
          Reviews and ratings from your clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="md:w-1/4 flex flex-col items-center">
            <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {reviewCount} reviews
            </p>
          </div>
          
          <div className="md:w-3/4">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                // Simulate percentage of reviews for each star rating
                const percent = rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 2 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{rating}</span>
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm text-muted-foreground">
                      {percent}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link href="/dashboard/provider/reviews">
            View All Reviews
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
