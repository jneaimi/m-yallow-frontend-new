"use client";

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api/providers';
import { FeaturedCategories } from '@/components/providers/featured-categories';
import { getIconByName } from '@/lib/api/icon-mapping';

export function DirectRenderingTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${API_BASE_URL}/public/categories`;
        console.log("DirectRenderingTest - Client-side fetch from:", url);
        
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
        console.log("API data for direct rendering:", result);
        
        if (result.categories && Array.isArray(result.categories)) {
          // Transform API categories to match the FeaturedCategories component format
          const transformedCategories = result.categories.map((category) => ({
            id: String(category.id),
            name: category.name,
            icon: getIconByName(category.icon),
            description: `Find ${category.name} providers and services`
          }));
          
          console.log(`Transformed ${transformedCategories.length} categories for direct rendering`);
          setCategories(transformedCategories);
        } else {
          throw new Error('Invalid categories data');
        }
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
    return <div className="p-4 bg-blue-50 rounded">Loading categories for direct rendering...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded">Error: {error}</div>;
  }

  if (categories.length === 0) {
    return <div className="p-4 bg-yellow-50 text-yellow-700 rounded">No categories found</div>;
  }

  return (
    <div>
      <div className="p-4 bg-green-50 rounded mb-4">
        <p className="font-medium text-green-700 mb-2">Rendering {categories.length} categories client-side:</p>
      </div>
      <FeaturedCategories categories={categories} />
    </div>
  );
}
