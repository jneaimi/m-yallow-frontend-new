import { auth } from '@clerk/nextjs/server';
import 'server-only';

/**
 * Retrieves the current user's authentication token for use in server-side API requests.
 * @returns {Promise<string | null>} The authentication token or null if not available.
 * @throws {Error} If there's an issue retrieving the token.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const session = auth();
    // Clerk's auth() doesn't provide a getToken method directly
    // We need to access the session token instead
    if (session && session.getToken) {
      return await session.getToken();
    }
    
    // If no session or method is available, return null
    console.warn('No auth session or getToken method available');
    return null;
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null; // Return null instead of throwing to avoid breaking the page
  }
}

/**
 * Retrieves the current user's ID for use in server-side API requests.
 * @returns {string | null} The user ID or null if not available.
 */
export function getAuthUserId(): string | null {
  const { userId } = auth();
  return userId;
}
