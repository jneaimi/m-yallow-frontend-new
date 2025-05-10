/**
 * Type definition for API error responses
 */
export type ApiError = {
  message?: string;
  response?: {
    data?: {
      detail?: string;
      message?: string;
      error?: string;
    }
  }
}

/**
 * Parses API errors and returns user-friendly error messages
 * @param error The error object from the API request
 * @returns A user-friendly error message
 */
export function parseApiError(error: unknown): string {
  // Default message
  const defaultMessage = 'Failed to submit request. Please try again.';
  
  const apiError = error as ApiError;
  
  // Client-side validation errors
  if (apiError.message) {
    if (apiError.message.includes('Invalid comment') || 
        apiError.message.includes('Invalid rating')) {
      return apiError.message;
    }
  }
  
  // Server-side errors
  if (apiError.response?.data) {
    const { data } = apiError.response;
    
    // Specific error cases
    if (data.detail === "You have already submitted a review for this provider") {
      return "You have already submitted a review for this provider.";
    }
    
    // Return first available error message from the server
    return data.message ? `Error: ${data.message}` :
           data.error ? `Error: ${data.error}` :
           data.detail ? `Error: ${data.detail}` :
           defaultMessage;
  }
  
  return defaultMessage;
}
