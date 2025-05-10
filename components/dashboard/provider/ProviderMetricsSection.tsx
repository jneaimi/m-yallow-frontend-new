'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MessageSquare, BookOpen } from "lucide-react";
import { useProviderMetrics } from "@/hooks/providers/use-provider-metrics";
import type { ProviderMetrics } from "@/hooks/providers/use-provider-metrics";

export function ProviderMetricsSection() {
  const { data: metrics, isLoading } = useProviderMetrics();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded w-1/4 mt-2"></div>
                <div className="h-2 bg-muted rounded w-full mt-2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Safely handle potentially undefined metrics data
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">No metrics data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return <MetricsCards metrics={metrics} />;
}

function MetricsCards({ metrics }: { metrics: ProviderMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Profile Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{metrics.views}</span>
            <Badge variant={metrics.viewsChange > 0 ? 'success' : 'destructive'} className="text-xs">
              {metrics.viewsChange > 0 ? '+' : ''}{metrics.viewsChange}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-primary" />
            Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{metrics.inquiries}</span>
            {metrics.inquiriesNew > 0 && (
              <Badge className="bg-primary text-xs">
                {metrics.inquiriesNew} new
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-primary" />
            Response Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{metrics.responseRate}%</span>
            </div>
            <Progress value={metrics.responseRate} className="h-2" />
            <p className="text-sm text-muted-foreground">Respond within 48 hours to maintain a high rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
