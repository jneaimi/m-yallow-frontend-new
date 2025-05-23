import { getAuthToken, getAuthUserId } from '@/lib/auth/server';
import { createApiClient } from '@/lib/api-client';
import 'server-only';

/**
 * Creates an authenticated API client for server components
 */
export async function createServerApiClient() {
  const token = await getAuthToken();
  const userId = getAuthUserId();
  return createApiClient(token || undefined, userId || undefined);
}
