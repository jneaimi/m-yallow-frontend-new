'use client';

/**
 * Type definition for network or request errors
 */
export type OfflineError = Error | { 
  message?: string; 
  code?: string;
  response?: { 
    status?: number;
    statusText?: string;
    data?: unknown;
  }
};

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
    onRetry?: (attempt: number, error: OfflineError | unknown) => void;
    onFallback?: (error: OfflineError | unknown) => void;
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
  let lastError: OfflineError | unknown = null;
  
  // Helper function to determine if error is network-related
  const isNetworkError = (error: OfflineError | unknown): boolean => {
    // Type guard for accessing properties safely
    const err = error as OfflineError;
    const errorMsg = (err?.message || '').toLowerCase();
    return (
      errorMsg.includes('network') || 
      errorMsg.includes('timeout') || 
      errorMsg.includes('abort') ||
      errorMsg.includes('failed to fetch') ||
      errorMsg === 'network error' ||
      err?.code === 'ECONNREFUSED' ||
      err?.code === 'ECONNABORTED' ||
      err?.code === 'ETIMEDOUT'
    );
  };
  
  // Helper to check if we should retry for this error
  const shouldRetry = (error: OfflineError | unknown): boolean => {
    // Network errors should be retried
    if (isNetworkError(error)) return true;
    
    // Retry server errors (5xx) but not client errors (4xx)
    const err = error as OfflineError;
    const status = err?.response?.status || 0;
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
    } catch (error: unknown) {
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
