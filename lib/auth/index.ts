import { auth } from '@clerk/nextjs/server';

export async function getAuthToken() {
  const { getToken } = auth();
  return await getToken();
}
