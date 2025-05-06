'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, Clock, CheckCircle, TrendingUp, Zap, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProvider } from '@/lib/context/provider-context';
import Link from 'next/link';

// This would be used for the approved provider dashboard
function ProviderMetrics() {
  // This would be replaced with actual data from an API
  const metrics = {
    views: 128,
    viewsChange: 12,
    bookmarks: 24,
    bookmarksChange: 5,
    inquiries: 7,
    inquiriesChange: 2,
    responseRate: 92,
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Profile Views</h4>
            <Badge variant="outline" className={metrics.viewsChange > 0 ? 'text-green-500' : 'text-red-500'}>
              {metrics.viewsChange > 0 ? '+' : ''}{metrics.viewsChange}%
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold">{metrics.views}</span>
            <span className="text-xs text-muted-foreground">this month</span>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Bookmarks</h4>
            <Badge variant="outline" className={metrics.bookmarksChange > 0 ? 'text-green-500' : 'text-red-500'}>
              {metrics.bookmarksChange > 0 ? '+' : ''}{metrics.bookmarksChange}%
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold">{metrics.bookmarks}</span>
            <span className="text-xs text-muted-foreground">total</span>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/50 p-3 rounded-md">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Response Rate</h4>
          <span className="text-sm font-medium">{metrics.responseRate}%</span>
        </div>
        <Progress value={metrics.responseRate} className="h-2 mt-2" />
        <p className="text-xs text-muted-foreground mt-2">
          You've responded to {metrics.inquiries} inquiries this month
        </p>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <p className="text-sm">
          Your profile visibility has increased by 15% since last month.
        </p>
      </div>
    </div>
  );
}

// This would be used for the pending provider application
function PendingApplication() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-700 dark:text-amber-400">Application Under Review</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Our team is currently reviewing your application. This process typically takes 1-3 business days.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>Application Progress</span>
          <span className="font-medium">2/4 steps</span>
        </div>
        <Progress value={50} className="h-2" />
        
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Application submitted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Initial screening</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm">Final review (in progress)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
            <span className="text-sm text-muted-foreground">Approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// This would be used for users who are not providers yet
function BecomeProvider() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Increase your visibility</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Connect with potential clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Build your reputation</p>
        </div>
      </div>
      
      <div className="bg-primary/10 rounded-md p-4 mt-4">
        <p className="text-sm">
          Join our community of trusted providers and grow your client base. Application is quick and free.
        </p>
      </div>
    </div>
  );
}

export function ProviderStatusWidget() {
  const { isProvider, isApproved, isLoading } = useProvider();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-36" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Provider is approved
  if (isProvider && isApproved) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Provider Dashboard
          </CardTitle>
          <CardDescription>
            Monitor your performance and manage inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderMetrics />
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full" asChild>
            <Link href="/dashboard/provider">
              Go to Provider Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Provider application is pending
  if (isProvider && !isApproved) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            Provider Application
          </CardTitle>
          <CardDescription>
            Your application is currently under review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PendingApplication />
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/become-provider">
              View Application Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Not a provider yet
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Become a Provider
        </CardTitle>
        <CardDescription>
          Share your services with our community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BecomeProvider />
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href="/dashboard/become-provider">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
