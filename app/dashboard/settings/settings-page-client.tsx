'use client';

import { useSettingsModel } from './model/settings-model';
import { checkAuthentication, isLoading } from './auth/settings-auth-controller';
import { SettingsLoading } from './ui/settings-loading';
import { ProfileInfoCard, AccountManagementCard, DeveloperSettingsCard } from './ui/settings-cards';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { UserSettingsForm } from './user-settings-form';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Settings page client component using the new dashboard layout
 */
export function SettingsPageClient() {
  // Get data from model
  const { user, isUserLoading, isSignedIn, isAuthLoaded, isDevelopment } = useSettingsModel();
  
  // Perform early authentication check - redirect and return null if not authenticated
  if (isAuthLoaded && !isSignedIn) {
    checkAuthentication(isAuthLoaded, isSignedIn);
    return null; // Stop rendering immediately
  }
  
  return (
    <AuthWrapper loadingText="Loading your settings...">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            {/* Simple breadcrumb navigation */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-medium text-foreground">Account Settings</span>
            </div>
            <h1 className="text-2xl font-bold mt-2">Account Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="pt-4">
              <Card className="p-6">
                <UserSettingsForm />
              </Card>
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account" className="pt-4">
              <AccountManagementCard />
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="pt-4">
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
                <p className="text-muted-foreground mb-6">
                  Manage how you receive notifications and updates from M-Yallow
                </p>
                
                <div className="space-y-4">
                  {/* Notification preferences UI would go here */}
                  <p>Notification preferences UI will be implemented here.</p>
                </div>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="pt-4">
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Security Settings</h2>
                <p className="text-muted-foreground mb-6">
                  Manage your account security and authentication options
                </p>
                
                <div className="space-y-4">
                  {/* Security settings UI would go here */}
                  <p>Security settings UI will be implemented here.</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Development card only shown in development environment */}
          {isDevelopment && <DeveloperSettingsCard user={user} />}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}