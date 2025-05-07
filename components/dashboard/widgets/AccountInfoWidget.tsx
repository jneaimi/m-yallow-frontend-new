'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, ArrowRight, Edit, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/lib/context/user-context';
import { format } from 'date-fns';
import Link from 'next/link';

export function AccountInfoWidget() {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-full max-w-[250px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Format user information
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User';
  const joinDate = user?.created_at 
    ? format(new Date(user.created_at), 'MMMM d, yyyy')
    : 'N/A';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Manage your personal details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || 'Not available'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{user?.phone || 'Not set'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">{joinDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Account Security</p>
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {user?.two_factor_enabled ? 'Two-factor enabled' : 'Basic security'}
                </p>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Link href="/dashboard/settings/security">
                    Manage
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" variant="outline" asChild>
          <Link href="/dashboard/settings">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
