"use client";

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api/providers';

export function ApiTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${API_BASE_URL}/public/categories`;
        console.log("Client-side fetch from:", url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("API data:", result);
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4 bg-blue-50 rounded">Loading API data...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-green-50 rounded">
      <p className="font-medium text-green-700 mb-2">API Response (Client-side):</p>
      <pre className="text-xs overflow-auto bg-white p-2 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="mt-2 text-sm text-green-700">
        Found {data?.categories?.length || 0} categories
      </p>
    </div>
  );
}
