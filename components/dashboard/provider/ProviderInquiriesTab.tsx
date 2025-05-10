'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProviderInquiries } from "@/hooks/providers/use-provider-inquiries";
import type { Inquiry } from "@/hooks/providers/use-provider-inquiries";

export function ProviderInquiriesTab() {
  const { data: inquiries, isLoading } = useProviderInquiries();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Function to handle responding to an inquiry
  const handleRespond = async (id: string) => {
    setProcessingId(id);
    try {
      // Navigate to the response page
      router.push(`/dashboard/provider/inquiries/${id}/respond`);
    } catch (error) {
      console.error("Error navigating to response page:", error);
    } finally {
      // In a real implementation, you might not need this if navigation takes the user away
      // But it's good practice in case there's an error
      setProcessingId(null);
    }
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 24) {
      return `${Math.floor(diffHrs)} hours ago`;
    } else {
      const diffDays = diffHrs / 24;
      return `${Math.floor(diffDays)} days ago`;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Client Inquiries</CardTitle>
          <CardDescription>
            Respond promptly to increase your response rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="flex justify-between mt-3">
                      <div className="h-3 bg-muted rounded w-1/5"></div>
                      <div className="h-8 bg-muted rounded w-24"></div>
                    </div>
                  </div>
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
      <CardHeader>
        <CardTitle className="text-lg">Recent Client Inquiries</CardTitle>
        <CardDescription>
          Respond promptly to increase your response rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inquiries && inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-start gap-3 border-b pb-4 last:border-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-medium">
                    {inquiry.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{inquiry.name}</h4>
                    {inquiry.isNew && (
                      <Badge className="bg-primary text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {inquiry.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(inquiry.date)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRespond(inquiry.id)}
                      disabled={processingId === inquiry.id}
                      aria-label="Respond to inquiry"
                    >
                      {processingId === inquiry.id ? "Processing..." : "Respond"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No inquiries yet</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link href="/dashboard/provider/inquiries">
            View All Inquiries
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
