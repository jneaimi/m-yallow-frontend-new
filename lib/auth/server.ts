import { auth } from '@clerk/nextjs/server';
import 'server-only';

/**
 * Retrieves the current user's authentication token for use in server-side API requests.
 * @returns {Promise<string | null>} The authentication token or null if not available.
 * @throws {Error} If there's an issue retrieving the token.
 */
export async function getAuthToken(): Promise<string | null> {
  const { getToken } = auth();
  try {
    return await getToken();
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    throw error;
  }
}
