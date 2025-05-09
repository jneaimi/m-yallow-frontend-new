import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { fetchPublicCategories, ApiCategory } from '@/lib/api/categories';

/**
 * Custom hook to fetch a category name by ID
 */
export function useCategoryName(categoryId: string) {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: async () => {
      const data = await fetchPublicCategories();
      // Return the raw categories array for consistency
      return data.categories.map(category => ({
        id: String(category.id),
        name: category.name,
        icon: category.icon
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for categories which change less frequently
  });

  // Derive the category name from the categories data
  let categoryName = `Category ${categoryId}`;
  
  if (query.data && Array.isArray(query.data)) {
    const category = query.data.find(
      (cat: { id: string | number }) => String(cat.id) === categoryId
    );
    if (category) {
      categoryName = category.name;
    }
  }

  return {
    ...query,
    categoryName,
  };
}
