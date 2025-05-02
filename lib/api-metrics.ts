'use client';

// Simple metrics tracking for API requests
interface ApiMetric {
  endpoint: string;
  method: string;
  startTime: number;
  endTime?: number;
  status?: number;
  error?: string;
  duration?: number;
}

class ApiMetricsTracker {
  private metrics: ApiMetric[] = [];
  private maxStoredMetrics = 100; // Store last 100 requests
  
  // Start timing a request
  startTiming(endpoint: string, method: string): string {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.metrics.unshift({
      endpoint,
      method,
      startTime: performance.now(),
    });
    
    // Trim metrics array if it gets too long
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(0, this.maxStoredMetrics);
    }
    
    return id;
  }
  
  // End timing a request
  endTiming(id: string, status?: number, error?: string) {
    const index = this.metrics.findIndex(m => `${m.startTime}-${m.endpoint}` === id);
    if (index >= 0) {
      const metric = this.metrics[index];
      metric.endTime = performance.now();
      metric.status = status;
      metric.error = error;
      metric.duration = metric.endTime - metric.startTime;
      
      // Log slow requests (over 1 second)
      if (metric.duration > 1000) {
        console.warn(`Slow API request: ${metric.method} ${metric.endpoint} took ${metric.duration.toFixed(2)}ms`);
      }
    }
  }
  
  // Get all metrics
  getMetrics() {
    return [...this.metrics];
  }
  
  // Get metrics for a specific endpoint
  getMetricsForEndpoint(endpoint: string) {
    return this.metrics.filter(m => m.endpoint.includes(endpoint));
  }
  
  // Get average duration for an endpoint
  getAverageDuration(endpoint?: string) {
    const relevantMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint.includes(endpoint) && m.duration !== undefined)
      : this.metrics.filter(m => m.duration !== undefined);
      
    if (relevantMetrics.length === 0) return 0;
    
    const sum = relevantMetrics.reduce((acc, m) => acc + (m.duration || 0), 0);
    return sum / relevantMetrics.length;
  }
  
  // Get error rate for an endpoint
  getErrorRate(endpoint?: string) {
    const relevantMetrics = endpoint 
      ? this.metrics.filter(m => m.endpoint.includes(endpoint) && m.endTime !== undefined)
      : this.metrics.filter(m => m.endTime !== undefined);
      
    if (relevantMetrics.length === 0) return 0;
    
    const errorCount = relevantMetrics.filter(m => 
      (m.status && m.status >= 400) || m.error
    ).length;
    
    return errorCount / relevantMetrics.length;
  }
  
  // Clear all metrics
  clearMetrics() {
    this.metrics = [];
  }
}

// Create a singleton instance
export const apiMetrics = new ApiMetricsTracker();

// Utility wrapper for axios/fetch requests
export async function withMetrics<T>(
  endpoint: string,
  method: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const metricId = apiMetrics.startTiming(endpoint, method);
  
  try {
    const result = await apiCall();
    apiMetrics.endTiming(metricId, 200);
    return result;
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorMessage = error.message || 'Unknown error';
    apiMetrics.endTiming(metricId, status, errorMessage);
    throw error;
  }
}