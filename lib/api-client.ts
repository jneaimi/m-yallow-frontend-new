import { getAuthToken } from './auth';
import axios from 'axios';

export async function createApiClient() {
  const token = await getAuthToken();
  
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}

// Client-side version using Clerk's useAuth hook
export function createClientApiClient(token?: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}
