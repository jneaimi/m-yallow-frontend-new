'use client';

import { useUser } from '@/lib/context/user-context';
import { useAuth } from '@clerk/nextjs';

/**
 * Settings data model 
 * Exposes data and state for settings pages
 */
export function useSettingsModel() {
  const { user, isLoading: isUserLoading } = useUser();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  
  return {
    user,
    isUserLoading,
    isSignedIn,
    isAuthLoaded,
    isDevelopment: process.env.NODE_ENV === 'development'
  };
}
