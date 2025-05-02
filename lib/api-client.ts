import axios from 'axios';

// Server-side API client creator
export async function createApiClient(token?: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}

// Client-side API client creator
export function createClientApiClient(token?: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}
