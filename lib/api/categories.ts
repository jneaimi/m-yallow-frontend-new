import { API_BASE_URL } from './providers';

// Category API endpoints
export const CATEGORY_API = {
  PUBLIC: `${API_BASE_URL}/public/categories`,
  LIST: `${API_BASE_URL}/categories`,
  DETAIL: (id: number) => `${API_BASE_URL}/categories/${id}`
};

// API interfaces
export interface ApiCategory {
  id: number;
  name: string;
  icon: string;
}

// Transformed category interface for client use
export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

// Response interface for categories list
export interface CategoriesListResponse {
  categories: ApiCategory[];
  total: number;
}

/**
 * Transform API category to client category
 * @param category API category object
 * @returns Transformed category for client use
 */
export function transformCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    icon: category.icon
  };
}

/**
 * Transform API categories list to client format
 * @param categories Array of API category objects
 * @returns Array of transformed categories for client use
 */
export function transformCategories(categories: ApiCategory[]): Category[] {
  return categories.map(transformCategory);
}

/**
 * Fetch public categories from the API
 * @returns Promise with categories list response
 */
export async function fetchPublicCategories(): Promise<CategoriesListResponse> {
  const url = CATEGORY_API.PUBLIC;
  console.log(`Fetching categories from: ${url}`);
  
  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache categories for 1 hour
    });
    
    console.log(`API Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.categories?.length || 0} categories`);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * QueryFn to use with TanStack Query for fetching and transforming categories
 * Can be shared between client and server components
 */
export async function categoriesQueryFn() {
  const data = await fetchPublicCategories();
  return transformCategories(data.categories);
}
