'use client';

import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Clock, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export function ActivityWidget() {
  const { recentActivity, isLoading, lastLogin } = useDashboard();
  
  // Activity type icons
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'bookmark':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Activity className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          {lastLogin ? (
            <>Last login: {formatDistanceToNow(lastLogin, { addSuffix: true })}</>
          ) : (
            <>Track your recent activity</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* View all button */}
            <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
              <a href="/dashboard/activity">
                View all activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No recent activity found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
