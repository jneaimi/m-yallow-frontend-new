import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiMetrics } from './api-metrics';

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

// Client-side API client creator with metrics tracking
export function createClientApiClient(token?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  
  // Add request interceptor for timing
  instance.interceptors.request.use((config) => {
    // Add timing info to the request config
    (config as any).metricId = apiMetrics.startTiming(
      config.url || 'unknown', 
      config.method?.toUpperCase() || 'GET'
    );
    return config;
  });
  
  // Add response interceptor for recording metrics
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const metricId = (response.config as any).metricId;
      if (metricId) {
        apiMetrics.endTiming(metricId, response.status);
      }
      return response;
    },
    (error) => {
      const metricId = (error.config as any)?.metricId;
      if (metricId) {
        const status = error.response?.status || 0;
        const errorMessage = error.message || 'Unknown error';
        apiMetrics.endTiming(metricId, status, errorMessage);
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
}
