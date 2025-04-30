import { fetchPublicCategories } from "@/lib/api/categories";
import { getIconByName } from "@/lib/api/icon-mapping";
import { HybridCategories } from "@/components/providers/hybrid-categories";
import { featuredCategories } from "@/components/providers/category-icons";

/**
 * Server component that fetches and displays public categories
 * using the hybrid approach (carousel + modal)
 */
export async function HybridPublicCategories() {
  try {
    const { categories } = await fetchPublicCategories();
    
    // Transform API categories to match the component format
    const transformedCategories = categories.map(category => ({
      id: String(category.id),
      name: category.name,
      icon: getIconByName(category.icon),
      description: `Find ${category.name} providers and services`
    }));
    
    return <HybridCategories categories={transformedCategories} />;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to static categories
    return <HybridCategories categories={featuredCategories} />;
  }
}
