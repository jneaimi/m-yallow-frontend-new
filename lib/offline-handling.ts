'use client';

/**
 * Enhanced function to handle offline requests with retry logic and better error tracking
 */
export async function withOfflineHandling<T>(
  callback: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    fallback?: T;
    onOffline?: () => void;
    onRetry?: (attempt: number, error: any) => void;
    onFallback?: (error: any) => void;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    fallback,
    onOffline,
    onRetry,
    onFallback
  } = options;
  
  let attemptCount = 0;
  let lastError: any = null;
  
  // Helper function to determine if error is network-related
  const isNetworkError = (error: any): boolean => {
    const errorMsg = (error?.message || '').toLowerCase();
    return (
      errorMsg.includes('network') || 
      errorMsg.includes('timeout') || 
      errorMsg.includes('abort') ||
      errorMsg.includes('failed to fetch') ||
      errorMsg === 'network error' ||
      error?.code === 'ECONNREFUSED' ||
      error?.code === 'ECONNABORTED' ||
      error?.code === 'ETIMEDOUT'
    );
  };
  
  // Helper to check if we should retry for this error
  const shouldRetry = (error: any): boolean => {
    // Network errors should be retried
    if (isNetworkError(error)) return true;
    
    // Retry server errors (5xx) but not client errors (4xx)
    const status = error?.response?.status || 0;
    return status >= 500 && status < 600;
  };
  
  while (attemptCount <= retries) {
    try {
      // Check if we're online
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // Call the offline handler if provided
        if (onOffline) onOffline();
        
        // If we have a fallback, use it and notify via callback
        if (fallback !== undefined) {
          const offlineError = new Error('You are offline. Using cached data.');
          if (onFallback) onFallback(offlineError);
          return fallback;
        }
        
        // Otherwise throw an error
        throw new Error('You are offline. Please check your internet connection and try again.');
      }
      
      // Try the request
      return await callback();
    } catch (error: any) {
      // Store last error for potential re-throw
      lastError = error;
      attemptCount++;
      
      // Check if we should retry this error
      if (!shouldRetry(error) || attemptCount > retries) {
        // If we have a fallback and error is retriable (but retries exhausted)
        if (fallback !== undefined && shouldRetry(error)) {
          console.warn('Exhausted retries, using fallback data', { error, attempts: attemptCount });
          if (onFallback) onFallback(error);
          return fallback;
        }
        
        // No more retries or non-retriable error, throw
        throw error;
      }
      
      // Notify about retry if callback provided
      if (onRetry) onRetry(attemptCount, error);
      
      // Log retry attempt
      console.warn(`Retry attempt ${attemptCount}/${retries} after error:`, error);
      
      // Exponential backoff for retries
      const delay = retryDelay * Math.pow(1.5, attemptCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we get here, we've exhausted all retries
  if (fallback !== undefined) {
    console.warn('Exhausted all retries, using fallback data');
    if (onFallback) onFallback(lastError);
    return fallback;
  }
  
  throw new Error('Request failed after multiple attempts. Please try again later.');
}
