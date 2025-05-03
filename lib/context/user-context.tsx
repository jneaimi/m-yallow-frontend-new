'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth, useUser as useClerkUser } from '@clerk/nextjs';
import { User as ClerkUser } from '@clerk/nextjs/server';
import { UserProfile, useUserProfileClient } from '@/lib/api/user-profile/client';
import { toast } from "sonner";
import { userContextConfig, UserDataSource } from './user-context-config';
import { withOfflineHandling } from '@/lib/offline-handling';

// Types
type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (data: Partial<UserProfile>) => Promise<UserProfile | null>;
  refreshUser: () => Promise<UserProfile | null>;
  setDataSource: (source: UserDataSource) => void;
  currentDataSource: UserDataSource;
};

type FetchOptions = {
  force?: boolean;
};

type UpdateOptions = {
  syncWithClerk?: boolean;
  syncWithBackend?: boolean;
};

// Helper functions - separated for better modularity
const userMappers = {
  // Helper function to convert Clerk user to UserProfile
  mapClerkUserToProfile: (clerkUser: ClerkUser): UserProfile => {
    return {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      first_name: clerkUser.firstName || '',
      last_name: clerkUser.lastName || '',
      avatar_url: clerkUser.imageUrl || null,
      created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: clerkUser.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
};

// Constants
const FETCH_CONSTANTS = {
  MIN_FETCH_INTERVAL: 2000, // Minimum 2 seconds between API calls
  MIN_AUTO_REFRESH_INTERVAL: 30000, // Minimum 30 seconds for auto-refresh
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  // State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<UserDataSource>(
    userContextConfig.get().dataSource
  );
  
  // Hooks
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const profileClient = useUserProfileClient();
  
  // Refs
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const initialFetchCompleteRef = useRef<boolean>(false);

  // Fetch user from backend
  const fetchFromBackend = useCallback(async (): Promise<UserProfile | null> => {
    try {
      // First attempt to get the user profile from the backend
      // Only use Clerk data as a last resort fallback
      const clerkFallbackData = clerkUser ? userMappers.mapClerkUserToProfile(clerkUser) : null;
      
      const fetchedProfile = await withOfflineHandling(
        async () => await profileClient.getUserProfile(),
        {
          retries: 3,  // Increase retries to be more resilient
          retryDelay: 1500, // Slightly longer delay between retries
          onOffline: () => {
            toast.warning("You're offline. Using cached user data.");
          },
          fallback: clerkFallbackData
        }
      );
      
      if (fetchedProfile) {
        // Successfully retrieved backend profile - this is the preferred outcome
        return fetchedProfile;
      } else if (clerkUser && !fetchedProfile) {
        // If backend fetch failed but we have Clerk data, use it as fallback
        // But also show a toast to let the user know we're using limited data
        toast.warning("Using basic profile data while connecting to our servers. Some features may be limited.");
        return clerkFallbackData;
      }
      
      return null;
    } catch (err) {
      // Enhanced error handling with more detailed reporting
      console.error('Failed to fetch user profile from backend:', err);
      
      // More descriptive error message
      if (err instanceof Error) {
        const errorMessage = err.message || 'Unknown error';
        const isNetworkError = errorMessage.includes('network') || 
                               errorMessage.includes('timeout') || 
                               errorMessage.includes('abort');
        
        if (isNetworkError) {
          throw new Error('Network error while loading your profile. Please check your connection.');
        } else {
          throw new Error('Failed to load your complete profile. Our team has been notified.');
        }
      } else {
        throw new Error('Failed to load your profile data.');
      }
    }
  }, [profileClient, clerkUser]);

  // Get user from Clerk
  const fetchFromClerk = useCallback((): UserProfile | null => {
    if (clerkUser) {
      return userMappers.mapClerkUserToProfile(clerkUser);
    }
    return null;
  }, [clerkUser]);

  // Function to fetch user profile from our backend with debouncing
  const fetchUser = useCallback(async ({ force = false }: FetchOptions = {}): Promise<UserProfile | null> => {
    if (!isSignedIn) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    // Don't fetch if we recently fetched unless force is true
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < FETCH_CONSTANTS.MIN_FETCH_INTERVAL) {
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
    
    try {
      let userData: UserProfile | null = null;
      
      if (dataSource === 'backend') {
        try {
          userData = await fetchFromBackend();
        } catch (err) {
          console.error('Failed to fetch user profile from backend:', err);
          setError((err as Error).message);
          
          // Fallback to Clerk data if backend fails
          userData = fetchFromClerk();
          
          // If fallback was successful, clear error state and show info toast
          if (userData) {
            setError(null); // Clear error state since we have a fallback
            toast.info('Using local profile data while we reconnect to our services');
          }
        }
      } else {
        // Use Clerk data directly
        userData = fetchFromClerk();
      }
      
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
      setIsLoading(false);
      return null;
    }
  }, [isSignedIn, dataSource, fetchFromBackend, fetchFromClerk, user]);

  // Update user in backend
  const updateBackendUser = useCallback(async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      // Use offline handling for the update
      return await withOfflineHandling(
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
    } catch (err) {
      console.error('Failed to update profile in backend:', err);
      throw new Error('Failed to update profile');
    }
  }, [profileClient]);

  // Update user in Clerk
  const updateClerkUser = useCallback(async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!clerkUser) return false;
    
    try {
      await clerkUser.update({
        firstName: data.first_name || undefined,
        lastName: data.last_name || undefined,
      });
      return true;
    } catch (err) {
      console.error('Failed to update Clerk profile:', err);
      throw new Error('Failed to update Clerk profile');
    }
  }, [clerkUser]);

  // Function to update user profile
  const updateUser = useCallback(async (
    data: Partial<UserProfile>, 
    options: UpdateOptions = {}
  ): Promise<UserProfile | null> => {
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
    
    try {
      let updatedProfile: UserProfile | null = null;
      
      // Always update backend first - backend is the source of truth
      try {
        updatedProfile = await updateBackendUser(data);
        
        // Backend update successful - optionally sync to Clerk if configured
        const shouldSyncWithClerk = options.syncWithClerk ?? userContextConfig.get().syncOnUpdate;
        if (shouldSyncWithClerk && updatedProfile) {
          try {
            await updateClerkUser(data);
          } catch (err) {
            console.error('Failed to sync data with Clerk:', err);
            // Don't fail the operation if Clerk sync fails - backend is source of truth
          }
        }
      } catch (err) {
        // Backend update failed
        console.error('Failed to update backend profile:', err);
        
        // If user explicitly chose Clerk as data source, fall back to Clerk
        if (dataSource === 'clerk') {
          toast.warning('Unable to update your full profile. Saving basic info only.');
          
          // Try Clerk update as fallback
          const success = await updateClerkUser(data);
          
          if (success) {
            // Refresh user data to get updated values
            updatedProfile = await fetchUser({ force: true });
          }
        } else {
          // If backend is preferred source and update failed, show error and rollback
          throw err;
        }
      }
      
      if (updatedProfile) {
        setUser(updatedProfile);
        toast.success('Your profile has been updated successfully.');
        return updatedProfile;
      } else {
        // Revert the optimistic update if we have no confirmation
        rollback();
        return null;
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      rollback();
      // Show more specific error message
      if (err instanceof Error) {
        toast.error(`Profile update failed: ${err.message}`);
      } else {
        toast.error('Profile update failed. Please try again later.');
      }
      return null;
    }
  }, [isSignedIn, dataSource, user, updateBackendUser, updateClerkUser, fetchUser]);

  // Function to change data source
  const changeDataSource = useCallback((source: UserDataSource) => {
    setDataSource(source);
    userContextConfig.update({ dataSource: source });
    // Refetch user data when source changes
    fetchUser({ force: true });
  }, [fetchUser]);

  // Setup auto-refresh if configured
  const setupAutoRefresh = useCallback(() => {
    const config = userContextConfig.get();
    
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    // Only set up auto-refresh if configured and user is signed in
    if (config.autoRefreshInterval && isSignedIn) {
      // Use a higher interval (minimum 30 seconds)
      const safeInterval = Math.max(
        config.autoRefreshInterval, 
        FETCH_CONSTANTS.MIN_AUTO_REFRESH_INTERVAL
      );
      
      // Only refresh if the document is visible to avoid background fetches
      const refreshIfVisible = () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
          fetchUser();
        }
      };
      
      refreshIntervalRef.current = setInterval(refreshIfVisible, safeInterval);
    }
  }, [isSignedIn, fetchUser]);

  // Initial fetch when auth state is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && !initialFetchCompleteRef.current) {
      initialFetchCompleteRef.current = true;
      fetchUser({ force: true }); // Force fetch on initial load
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, fetchUser]);

  // Setup auto-refresh
  useEffect(() => {
    setupAutoRefresh();
    
    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [setupAutoRefresh]);

  // Provide context value
  const value = {
    user,
    isLoading,
    error,
    updateUser: (data: Partial<UserProfile>) => updateUser(data),
    refreshUser: () => fetchUser({ force: true }),
    setDataSource: changeDataSource,
    currentDataSource: dataSource,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
