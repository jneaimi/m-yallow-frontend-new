import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { UserSettingsForm } from './user-settings-form';

export default async function SettingsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
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
            <Button asChild>
              <a href="/user-profile">
                Manage Account Settings
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
