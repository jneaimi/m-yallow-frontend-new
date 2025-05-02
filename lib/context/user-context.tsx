'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth, useUser as useClerkUser } from '@clerk/nextjs';
import { UserProfile, useUserProfileClient } from '@/lib/api/user-profile/client';
import { toast } from "sonner";
import { userContextConfig, UserDataSource } from './user-context-config';
import { useNetworkState } from '@/lib/network-context';
import { withOfflineHandling } from '@/lib/offline-handling';

type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
  refreshUser: () => Promise<UserProfile | null>;
  setDataSource: (source: UserDataSource) => void;
  currentDataSource: UserDataSource;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<UserDataSource>(
    userContextConfig.get().dataSource
  );
  
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const profileClient = useUserProfileClient();
  
  // Ref for storing the auto-refresh interval
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add debounce timer to prevent multiple rapid API calls
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 2000; // Minimum 2 seconds between API calls

  // Function to fetch user profile from our backend with debouncing
  const fetchUser = useCallback(async (force = false): Promise<UserProfile | null> => {
    if (!isSignedIn) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    // Don't fetch if we recently fetched unless force is true
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      return user;
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Return existing user data immediately if available
    if (user && !force) {
      return user;
    }

    setIsLoading(true);
    setError(null);
    
    // Set last fetch time
    lastFetchTimeRef.current = now;
    
    if (dataSource === 'backend') {
      try {
        // Use offline handling with fallback to Clerk data
        const clerkFallbackData = clerkUser ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          avatar_url: clerkUser.imageUrl || null,
          created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
          updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString(),
        } : null;
        
        const fetchedProfile = await withOfflineHandling(
          async () => await profileClient.getUserProfile(),
          {
            retries: 2,
            onOffline: () => {
              toast.warning("You're offline. Using cached user data.");
            },
            fallback: clerkFallbackData
          }
        );
        
        if (fetchedProfile) {
          setUser(fetchedProfile);
          setIsLoading(false);
          return fetchedProfile;
        } else if (clerkUser && !fetchedProfile) {
          // If offline handling returned null but we have Clerk data
          setUser(clerkFallbackData);
          setIsLoading(false);
          return clerkFallbackData;
        }
        
        setIsLoading(false);
        return null;
      } catch (err) {
        console.error('Failed to fetch user profile from backend:', err);
        setError('Failed to load your profile');
        setIsLoading(false);
        
        // Fallback to Clerk data if backend fails
        if (clerkUser) {
          const clerkData: UserProfile = {
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            first_name: clerkUser.firstName || '',
            last_name: clerkUser.lastName || '',
            avatar_url: clerkUser.imageUrl || null,
            created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
            updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString(),
          };
          setUser(clerkData);
          return clerkData;
        }
        
        return null;
      }
    } else {
      // Use Clerk data directly
      if (clerkUser) {
        const clerkData: UserProfile = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          avatar_url: clerkUser.imageUrl || null,
          created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
          updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString(),
        };
        setUser(clerkData);
        setIsLoading(false);
        return clerkData;
      }
      
      setIsLoading(false);
      return null;
    }
  }, [isSignedIn, dataSource, profileClient, clerkUser]);

  // Function to update user profile
  const updateUser = useCallback(async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!isSignedIn) {
      toast.info('Please sign in to update your profile');
      return null;
    }

    // Save the previous state for rollback if needed
    const previousUser = user;
    
    // Optimistic update
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    // Function to handle rollback
    const rollback = () => {
      setUser(previousUser);
      toast.error('Failed to update your profile. Changes have been reverted.');
    };
    
    if (dataSource === 'backend') {
      try {
        // Use offline handling for the update
        const updatedProfile = await withOfflineHandling(
          async () => await profileClient.updateUserProfile(data),
          {
            retries: 2,
            onOffline: () => {
              toast.error("You're offline. Changes will be saved when you're back online.");
              // Create a synchronization queue here if needed for offline-first functionality
            },
            fallback: null
          }
        );
        
        // If the update was successful
        if (updatedProfile) {
          setUser(updatedProfile);
          toast.success('Your profile has been updated successfully.');
          
          // Sync with Clerk if configured
          if (userContextConfig.get().syncOnUpdate && clerkUser) {
            try {
              await clerkUser.update({
                firstName: data.first_name || undefined,
                lastName: data.last_name || undefined,
              });
            } catch (err) {
              console.error('Failed to sync data with Clerk:', err);
              // Don't fail the operation if Clerk sync fails
            }
          }
          
          return updatedProfile;
        } else {
          // If offline handling returned null, keep optimistic update
          // This would be the place to queue the changes for later synchronization
          return null;
        }
      } catch (err) {
        console.error('Failed to update profile:', err);
        // Revert the optimistic update
        rollback();
        return null;
      }
    } else {
      // Update Clerk data directly
      if (clerkUser) {
        try {
          await clerkUser.update({
            firstName: data.first_name || undefined,
            lastName: data.last_name || undefined,
          });
          
          toast.success('Your profile has been updated successfully.');
          
          // Sync with backend if configured
          if (userContextConfig.get().syncOnUpdate) {
            try {
              // Use offline handling for the backend sync
              await withOfflineHandling(
                async () => await profileClient.updateUserProfile(data),
                {
                  retries: 1,
                  onOffline: () => {
                    toast.warning("You're offline. Backend synchronization will happen when you're back online.");
                  }
                }
              );
            } catch (err) {
              console.error('Failed to sync data with backend:', err);
              // Don't fail the operation if backend sync fails
            }
          }
          
          // Refresh user data to get updated values
          return fetchUser();
        } catch (err) {
          console.error('Failed to update Clerk profile:', err);
          // Revert the optimistic update
          rollback();
          return null;
        }
      }
      
      toast.error('User not found. Please sign in again.');
      rollback();
      return null;
    }
  }, [isSignedIn, dataSource, profileClient, clerkUser, fetchUser]);

  // Function to change data source
  const changeDataSource = useCallback((source: UserDataSource) => {
    setDataSource(source);
    userContextConfig.update({ dataSource: source });
    // Refetch user data when source changes
    fetchUser();
  }, [fetchUser]);

  // Initial fetch when auth state is loaded - with state tracking to prevent multiple fetches
  const initialFetchCompleteRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (isLoaded && isSignedIn && !initialFetchCompleteRef.current) {
      initialFetchCompleteRef.current = true;
      fetchUser(true); // Force fetch on initial load
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, fetchUser]);

  // Setup auto-refresh if configured - with more conservative approach
  useEffect(() => {
    const config = userContextConfig.get();
    
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    // Only set up auto-refresh if:
    // 1. It's configured
    // 2. User is signed in
    // 3. We're in active tab (using visibility API)
    if (config.autoRefreshInterval && isSignedIn) {
      // Use a higher interval (30 seconds minimum)
      const safeInterval = Math.max(config.autoRefreshInterval, 30000);
      
      // Only refresh if the document is visible to avoid background fetches
      const refreshIfVisible = () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
          fetchUser();
        }
      };
      
      refreshIntervalRef.current = setInterval(refreshIfVisible, safeInterval);
    }
    
    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isSignedIn, fetchUser]);

  // Provide context value
  const value = {
    user,
    isLoading,
    error,
    updateUser,
    refreshUser: fetchUser,
    setDataSource: changeDataSource,
    currentDataSource: dataSource,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
