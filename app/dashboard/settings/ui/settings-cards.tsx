'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSettingsForm } from '../user-settings-form';
import { ClerkManageAccountButton } from '@/components/auth/clerk-manage-account-button';
import { DataSourceToggle } from '@/components/ui/data-source-toggle';

interface DeveloperCardProps {
  user: any;
}

/**
 * Profile information card component
 */
export function ProfileInfoCard() {
  return (
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
  );
}

/**
 * Account management card component
 */
export function AccountManagementCard() {
  return (
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
  );
}

/**
 * Developer settings card component
 */
export function DeveloperSettingsCard({ user }: DeveloperCardProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
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
  );
}
