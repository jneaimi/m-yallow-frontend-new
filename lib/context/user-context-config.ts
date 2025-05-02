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
  dataSource: 'backend', // Use our backend as the primary source
  syncOnUpdate: true,    // Keep Clerk and our backend in sync when data changes
  autoRefreshInterval: null, // No auto refresh by default - this prevents excessive API calls
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
