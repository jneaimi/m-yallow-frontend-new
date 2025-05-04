'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useProvider } from "@/lib/context/provider-context";

export function ProviderStatusBanner() {
  const { isProvider, isApproved, isLoading } = useProvider();

  // Show loading state
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Provider Status
          </CardTitle>
          <CardDescription>
            Loading your provider information...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Not a provider yet - show "Become a Provider" banner
  if (!isProvider) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Become a Provider
          </CardTitle>
          <CardDescription>
            Share your services with our community and grow your client base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-start space-y-1.5">
              <div className="flex items-center text-sm">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>Increase your visibility</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>Connect with potential clients</span>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-1.5">
              <div className="flex items-center text-sm">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>Build your reputation</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                <span>Free to join</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/become-provider">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Provider awaiting approval
  if (isProvider && !isApproved) {
    return (
      <Card className="bg-gradient-to-br from-amber-100 to-background border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-700">
            <Clock className="mr-2 h-5 w-5" />
            Provider Application Pending
          </CardTitle>
          <CardDescription>
            Your application is currently under review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Thank you for applying to become a provider! Our team is reviewing your application and 
            will notify you once it's approved. This process typically takes 1-3 business days.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Provider approved - show link to provider dashboard
  return (
    <Card className="bg-gradient-to-br from-green-100 to-background border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-700">
          <CheckCircle className="mr-2 h-5 w-5" />
          Provider Dashboard
        </CardTitle>
        <CardDescription>
          Manage your provider profile and services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your provider account is active. Use the provider dashboard to manage your 
          information, respond to inquiries, and track your performance.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full sm:w-auto">
          <Link href="/dashboard/provider">
            Go to Provider Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
