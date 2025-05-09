import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { categoriesQueryFn, Category } from '@/lib/api/categories';

/**
 * Custom hook to fetch a category name by ID
 */
export function useCategoryName(categoryId: string) {
  const query = useQuery({
    queryKey: queryKeys.categories.public(),
    queryFn: categoriesQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes for categories which change less frequently
  });

  // Derive the category name from the categories data
  let categoryName = `Category ${categoryId}`;
  
  if (query.data && Array.isArray(query.data)) {
    const category = query.data.find(
      (cat: Category) => String(cat.id) === categoryId
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
