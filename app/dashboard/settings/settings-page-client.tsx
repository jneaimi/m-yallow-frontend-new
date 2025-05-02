'use client';

import { redirect } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { UserSettingsForm } from './user-settings-form';
import { ClerkManageAccountButton } from '@/components/auth/clerk-manage-account-button';
import { useUser } from '@/lib/context/user-context';
import { useAuth } from '@clerk/nextjs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DataSourceToggle } from '@/components/ui/data-source-toggle';

export function SettingsPageClient() {
  const { user, isLoading } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  
  // Handle authentication check - with more efficient approach
  const authChecked = useRef(false);
  
  useEffect(() => {
    if (isLoaded && !isSignedIn && !authChecked.current) {
      authChecked.current = true;
      redirect('/sign-in');
    }
  }, [isLoaded, isSignedIn]);
  
  // Handle loading state
  if (isLoading || !isLoaded) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <LoadingSpinner size={32} text="Loading your settings..." className="flex-col" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your account information and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>
              Manage your Clerk account settings, password, and other security options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              For account security settings like password changes, two-factor authentication, and more, 
              please use the Clerk user management options below.
            </p>
            <ClerkManageAccountButton />
          </CardContent>
        </Card>
        
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle>Developer Settings</CardTitle>
              <CardDescription>
                These settings are only visible in development mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataSourceToggle className="mb-4" />
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <h4 className="text-sm font-medium mb-2">Current User Data</h4>
                <pre className="text-xs overflow-auto max-h-60">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
