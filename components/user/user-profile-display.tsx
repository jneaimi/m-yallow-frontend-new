'use client';

import { useUserProfile } from '@/lib/api/user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function UserProfileDisplay() {
  const { profile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            <Skeleton className="h-8 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !profile) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Error</CardTitle>
          <CardDescription>
            There was an error loading your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            {error.message || 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">No Profile</CardTitle>
          <CardDescription>
            No profile information is available.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Format the full name
  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(' ') || 'No name provided';
    
  // Get initials for avatar fallback
  const initials = [profile.first_name?.[0], profile.last_name?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || '?';

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
        <CardDescription>
          Your personal profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-medium">{fullName}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p>
            Account created: {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
