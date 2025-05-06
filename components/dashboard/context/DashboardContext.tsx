'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/lib/context/user-context';
import { useProvider } from '@/lib/context/provider-context';

type WidgetType = 'activity' | 'bookmarks' | 'reviews' | 'provider' | 'account';

interface DashboardPreferences {
  visibleWidgets: WidgetType[];
  widgetOrder: WidgetType[];
  collapsed: boolean;
}

interface DashboardContextType {
  // User dashboard preferences
  preferences: DashboardPreferences;
  updatePreferences: (newPrefs: Partial<DashboardPreferences>) => void;
  
  // Dashboard state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Dashboard data
  recentActivity: any[]; // Replace with proper types when implementing actual activity tracking
  isLoading: boolean;
  
  // Helpers
  isNewUser: boolean;
  isProvider: boolean;
  lastLogin: Date | null;
  getGreeting: () => string;
}

// Default preferences
const defaultPreferences: DashboardPreferences = {
  visibleWidgets: ['activity', 'bookmarks', 'reviews', 'provider', 'account'],
  widgetOrder: ['activity', 'bookmarks', 'reviews', 'provider', 'account'],
  collapsed: false,
};

// Create the context with a default value
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: userLoading } = useUser();
  const { isProvider, isLoading: providerLoading } = useProvider();
  
  // Dashboard state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  
  // Determine if user is new (account created within the last 7 days)
  const isNewUser = user?.created_at
    ? new Date().getTime() - new Date(user.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    : false;
  
  // Update preferences
  const updatePreferences = (newPrefs: Partial<DashboardPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs,
    }));
    
    // TODO: Save preferences to user profile or local storage
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Load user preferences (simulated for now)
  useEffect(() => {
    if (user) {
      // This would be replaced with actual API calls or local storage retrieval
      const loadPreferences = async () => {
        // Simulating loading preferences from storage or API
        const storedPrefs = localStorage.getItem(`dashboard_prefs_${user.id}`);
        if (storedPrefs) {
          try {
            setPreferences(JSON.parse(storedPrefs));
          } catch (e) {
            console.error('Failed to parse dashboard preferences');
          }
        }
        
        // Simulate loading last login time
        setLastLogin(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 1 day ago
        
        // Simulate loading recent activity
        setRecentActivity([
          { type: 'login', timestamp: new Date(), description: 'You logged in' },
          { type: 'bookmark', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), description: 'You bookmarked a provider' },
          { type: 'review', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), description: 'You left a review' },
        ]);
      };
      
      loadPreferences();
    }
  }, [user?.id]);
  
  // Save preferences when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`dashboard_prefs_${user.id}`, JSON.stringify(preferences));
    }
  }, [preferences, user?.id]);
  
  const value: DashboardContextType = {
    preferences,
    updatePreferences,
    isSidebarOpen,
    toggleSidebar,
    recentActivity,
    isLoading: userLoading || providerLoading,
    isNewUser,
    isProvider,
    lastLogin,
    getGreeting,
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook to use the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
