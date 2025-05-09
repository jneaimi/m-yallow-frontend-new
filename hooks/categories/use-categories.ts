import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchPublicCategories } from '@/lib/api/categories';
import { getIconByName } from '@/lib/api/icon-mapping';
import { featuredCategories } from '@/components/providers/category-icons';
import React, { useMemo } from 'react';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface RawCategory {
  id: string | number;
  name: string;
  icon: string | React.ReactNode;
  description?: string;
}

/**
 * Custom hook to fetch and manage categories data using TanStack Query
 * Handles data fetching, caching, and error states
 * @returns The query result object with categories data
 */
export function useCategories() {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: async () => {
      try {
        const { categories } = await fetchPublicCategories();
        
        // Return raw categories with icon as string for caching
        return categories.map(category => ({
          id: String(category.id),
          name: category.name,
          icon: category.icon, // Store as string for caching
          description: `Find ${category.name} providers and services`
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to static categories
        return featuredCategories.map(category => ({
          ...category,
          // If icon is a React element, use a special marker to indicate it's already processed
          icon: typeof category.icon === 'string' ? category.icon : '__REACT_ELEMENT__'
        }));
      }
    },
    staleTime: 3600000, // 1 hour cache time, matching the revalidation from the original fetch
  });
  
  // Process the raw data to transform string icons into React components
  const processedCategories = useMemo(() => {
    if (!query.data) return undefined;
    
    return query.data.map((category: RawCategory) => ({
      id: String(category.id),
      name: category.name,
      // Transform string icons to React components, but keep already processed icons
      icon: typeof category.icon === 'string' && category.icon !== '__REACT_ELEMENT__' 
        ? getIconByName(category.icon) 
        : category.icon,
      description: category.description || `Find ${category.name} providers and services`
    }));
  }, [query.data]);
  
  // Return the query object with processed data
  return {
    ...query,
    data: processedCategories
  };
}
