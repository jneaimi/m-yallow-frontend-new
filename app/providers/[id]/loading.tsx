import { ResponsiveContainer } from "@/components/ui/responsive";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProviderLoading() {
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/providers/search" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to providers
            </Link>
          </Button>
        </div>
        
        {/* Hero image skeleton */}
        <Skeleton className="w-full h-64 md:h-96 rounded-xl mb-8" />
        
        {/* Provider header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-2/3 max-w-md mb-4" />
          <Skeleton className="h-5 w-1/2 max-w-xs mb-4" />
          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left column */}
          <div className="md:col-span-2">
            <Skeleton className="h-10 w-32 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
          </div>
          
          {/* Right column */}
          <div className="bg-muted/30 p-6 rounded-xl h-fit">
            <Skeleton className="h-8 w-40 mb-6" />
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
