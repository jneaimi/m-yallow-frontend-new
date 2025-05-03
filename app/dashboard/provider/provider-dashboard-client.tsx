'use client';

import { useProvider } from '@/lib/context/provider-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProviderDashboardClient() {
  const { isProvider, isApproved, providerData, isLoading } = useProvider();
  const router = useRouter();
  
  // Redirect if not a provider or not approved
  useEffect(() => {
    if (!isLoading && (!isProvider || !isApproved)) {
      router.push('/dashboard');
    }
  }, [isProvider, isApproved, isLoading, router]);

  return (
    <AuthWrapper loadingText="Loading your provider dashboard...">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Provider Profile</CardTitle>
                <CardDescription>Manage your provider details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Name</h3>
                    <p>{providerData?.name || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Contact</h3>
                    <p>{providerData?.contact || 'Not available'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{providerData?.location || 'Not available'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Your Provider Dashboard</CardTitle>
                <CardDescription>
                  Manage your provider profile, services, and client inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Your provider account is active and visible to potential clients. Use this dashboard to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Update your provider profile information</li>
                  <li>Manage your service categories</li>
                  <li>View and respond to client inquiries</li>
                  <li>Track your visibility and performance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
