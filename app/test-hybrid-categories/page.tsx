import { Suspense } from "react";
import { HybridPublicCategories } from "../providers/hybrid-public-categories";
import { ResponsiveContainer } from "@/components/ui/responsive";

export default function TestHybridCategoriesPage() {
  return (
    <div className="min-h-[80vh] py-16">
      <ResponsiveContainer maxWidth="xl">
        <h1 className="text-3xl font-bold mb-2">Hybrid Categories Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page demonstrates the hybrid approach for displaying categories using a carousel with a "View All" modal.
        </p>
        
        <div className="border rounded-lg p-6 mb-8 bg-primary/5">
          <h2 className="text-xl font-semibold mb-4">Hybrid Approach Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Category carousel with pagination and navigation controls</li>
            <li>Compact card design to save vertical space</li>
            <li>"View All" button to open a modal with all categories</li>
            <li>Categories grouped by type in the modal view</li>
            <li>Responsive layout for all screen sizes</li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Category Carousel</h2>
        <Suspense fallback={<div className="text-center py-8">Loading categories...</div>}>
          <HybridPublicCategories />
        </Suspense>
        
        <div className="mt-12 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2">User Experience Notes:</h3>
          <p className="text-sm text-muted-foreground">
            This hybrid approach balances the need to showcase all categories without overwhelming the homepage layout. 
            Users can browse popular categories in the carousel or access the complete list via the "View All" button. 
            In the modal view, categories are organized by type for easier browsing.
          </p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
