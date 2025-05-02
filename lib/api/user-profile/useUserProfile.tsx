'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserProfileClient, UserProfile } from './client';
import { useClerk, useUser } from '@clerk/nextjs';

export function useUserProfile() {
  const { getUserProfile } = useUserProfileClient();
  const { user } = useUser();
  const { user: clerkUser } = useClerk();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Try to fetch profile from our backend API
      const data = await getUserProfile();
      setProfile(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      setError(err);
      
      // Fallback to Clerk user data if backend returns 404
      if (err?.response?.status === 404 && clerkUser) {
        // Create a temporary profile from Clerk data
        const tempProfile: UserProfile = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          first_name: clerkUser.firstName || undefined,
          last_name: clerkUser.lastName || undefined,
          avatar_url: clerkUser.imageUrl || undefined,
          created_at: clerkUser.createdAt || new Date().toISOString(),
          updated_at: clerkUser.updatedAt || new Date().toISOString()
        };
        
        setProfile(tempProfile);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, clerkUser, getUserProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile };
}
