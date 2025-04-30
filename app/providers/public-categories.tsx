import { fetchPublicCategories } from "@/lib/api/categories";
import { getIconByName } from "@/lib/api/icon-mapping";
import { FeaturedCategories } from "@/components/providers/featured-categories";
import { featuredCategories } from "@/components/providers/category-icons";

/**
 * Server component that fetches and displays public categories
 * Falls back to static categories if the API call fails
 */
export async function PublicCategories() {
  try {
    console.log("Fetching public categories...");
    const data = await fetchPublicCategories();
    console.log("Public categories data:", data);
    
    if (!data || !data.categories || !Array.isArray(data.categories)) {
      console.error("Invalid categories data:", data);
      throw new Error("Invalid categories data");
    }
    
    const { categories } = data;
    console.log(`Got ${categories.length} categories from API`);
    
    // Transform API categories to match the FeaturedCategories component format
    const transformedCategories = categories.map(category => {
      const icon = getIconByName(category.icon);
      console.log(`Mapping category: ${category.name}, icon: ${category.icon}`);
      return {
        id: String(category.id),
        name: category.name,
        icon: icon,
        description: `Find ${category.name} providers and services`
      };
    });
    
    console.log(`Transformed ${transformedCategories.length} categories`);
    return <FeaturedCategories categories={transformedCategories} />;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to static categories
    console.log("Using fallback categories");
    return <FeaturedCategories categories={featuredCategories} />;
  }
}
