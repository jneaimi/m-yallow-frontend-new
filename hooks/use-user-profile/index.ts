'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from "sonner";
import { useUserProfileClient, UserProfile } from '@/lib/api/user-profile/client';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const profileClient = useUserProfileClient();

  const fetchProfile = useCallback(async () => {
    if (!isSignedIn) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedProfile = await profileClient.getUserProfile();
      setProfile(fetchedProfile);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load your profile');
      toast.error('Failed to load your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, profileClient]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!isSignedIn) {
      toast.info('Please sign in to update your profile');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await profileClient.updateUserProfile(data);
      setProfile(updatedProfile);
      
      toast.success('Your profile has been updated successfully');
      
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
      toast.error('Failed to update your profile. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, profileClient]);

  // Load profile on initial mount and when auth status changes
  useEffect(() => {
    if (isSignedIn) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [isSignedIn, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    fetchProfile,
  };
}
