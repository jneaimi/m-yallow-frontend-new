'use client';

// Function to handle offline requests with retry logic
export async function withOfflineHandling<T>(
  callback: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    fallback?: T;
    onOffline?: () => void;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    fallback,
    onOffline
  } = options;
  
  let attemptCount = 0;
  
  while (attemptCount <= retries) {
    try {
      // Check if we're online
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // Call the offline handler if provided
        if (onOffline) onOffline();
        
        // If we have a fallback, return it
        if (fallback !== undefined) return fallback;
        
        // Otherwise throw an error
        throw new Error('You are offline. Please check your internet connection and try again.');
      }
      
      // Try the request
      return await callback();
    } catch (error: any) {
      attemptCount++;
      
      // If it's not a network error or we've used all retries, throw
      if (
        (error.message !== 'Network Error' && !error.message?.includes('network')) ||
        attemptCount > retries
      ) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * attemptCount));
    }
  }
  
  // If we get here, we've exhausted all retries
  throw new Error('Request failed after multiple attempts. Please try again later.');
}
