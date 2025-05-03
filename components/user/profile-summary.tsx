'use client';

import { useUser } from '@/lib/context/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, Bookmark, Star } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProfileSummary() {
  const { user, isLoading } = useUser();
  
  if (isLoading || !user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-20">
            <LoadingSpinner size="sm" text="Loading profile..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get initials from backend user data
  const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  // Get full name from backend user data
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Manage your account and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url || ''} alt={fullName} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-semibold">
              {user.displayName || fullName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {user.email}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button variant="outline" size="sm" asChild className="justify-start">
                <Link href="/dashboard/bookmarks">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Providers
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="justify-start">
                <Link href="/dashboard/reviews">
                  <Star className="mr-2 h-4 w-4" />
                  My Reviews
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="justify-start">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
