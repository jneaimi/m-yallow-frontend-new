'use client';

// Configuration for the user context that can be accessed globally
export type UserDataSource = 'backend' | 'clerk';

interface UserContextConfig {
  dataSource: UserDataSource;
  syncOnUpdate: boolean;
  autoRefreshInterval: number | null; // in milliseconds, null means no auto refresh
}

// Default configuration
const defaultConfig: UserContextConfig = {
  dataSource: 'backend', // Use our backend as the authoritative source of truth
  syncOnUpdate: false,   // Don't sync profile updates to Clerk - our backend is the source of truth
  autoRefreshInterval: 60000, // Refresh profile data every minute to ensure we have latest backend data
};

// Singleton pattern to maintain a single config instance
let config = { ...defaultConfig };

export const userContextConfig = {
  // Getter for current config
  get: () => ({ ...config }), // Return a copy to prevent direct mutation
  
  // Update config
  update: (newConfig: Partial<UserContextConfig>) => {
    config = { ...config, ...newConfig };
    return { ...config }; // Return a copy of the updated config
  },
  
  // Reset to defaults
  reset: () => {
    config = { ...defaultConfig };
    return { ...config }; // Return a copy of the reset config
  },
};
