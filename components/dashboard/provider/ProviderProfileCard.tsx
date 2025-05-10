'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useProviderMe } from "@/hooks/providers/use-provider-me";

export function ProviderProfileCard() {
  const { data: providerData, isLoading } = useProviderMe();
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 animate-pulse">
            <div className="md:w-1/4">
              <div className="aspect-square rounded-md bg-muted"></div>
            </div>
            <div className="md:w-3/4 space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Provider Profile</CardTitle>
        <CardDescription>Your profile information as seen by potential clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <div className="aspect-square rounded-md bg-primary/10 flex items-center justify-center">
              {providerData?.logo ? (
                <img 
                  src={providerData.logo} 
                  alt={providerData.name || 'Provider Logo'} 
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-5xl font-bold text-primary">
                  {providerData?.name?.charAt(0) || 'P'}
                </span>
              )}
            </div>
          </div>
          
          <div className="md:w-3/4 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{providerData?.name || 'Your Provider Name'}</h3>
                <Badge variant="outline" className="ml-2">
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {providerData?.description || 'Your provider description will appear here. Make sure to add a detailed description that explains your services and expertise.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{providerData?.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Email</p>
                <p className="font-medium">{providerData?.contact || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{providerData?.category || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Last updated: {providerData?.updatedAt ? new Date(providerData.updatedAt).toLocaleDateString() : 'Never'}
          </span>
        </div>
        
        <Button variant="ghost" size="sm" asChild>
          <Link href="/providers/preview">
            View Public Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
