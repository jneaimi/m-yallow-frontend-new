"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CategoryCard } from "./category-card";
import { useCategories } from "@/hooks/categories/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { featuredCategories } from "./category-icons";

// Define category groups
const CATEGORY_GROUPS = {
  AUTOMOTIVE: "Automotive",
  CONSTRUCTION: "Construction & Building",
  INDUSTRIAL: "Industrial & Equipment",
  SERVICES: "Services & Maintenance"
};

// Function to assign categories to groups
function categorizeByGroup(categories: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {
    [CATEGORY_GROUPS.AUTOMOTIVE]: [],
    [CATEGORY_GROUPS.CONSTRUCTION]: [],
    [CATEGORY_GROUPS.INDUSTRIAL]: [],
    [CATEGORY_GROUPS.SERVICES]: [],
  };

  // Map category names to their respective groups
  // This is a simple implementation; in production, this would be based on category metadata
  const groupMappings: Record<string, string> = {
    "Auto Spare Parts": CATEGORY_GROUPS.AUTOMOTIVE,
    "Car Maintenance & Repair": CATEGORY_GROUPS.AUTOMOTIVE,
    "Tire Shops & Alignment": CATEGORY_GROUPS.AUTOMOTIVE,
    
    "Building Materials Suppliers": CATEGORY_GROUPS.CONSTRUCTION,
    "Construction Companies": CATEGORY_GROUPS.CONSTRUCTION,
    "Steel & Metal Works": CATEGORY_GROUPS.CONSTRUCTION,
    "Plumbing & Sanitary Ware": CATEGORY_GROUPS.CONSTRUCTION,
    "Welding & Fabrication": CATEGORY_GROUPS.CONSTRUCTION,
    "Paints & Coatings": CATEGORY_GROUPS.CONSTRUCTION,
    
    "Power Tools & Equipment": CATEGORY_GROUPS.INDUSTRIAL,
    "Industrial Chemicals": CATEGORY_GROUPS.INDUSTRIAL,
    "Warehouse & Storage": CATEGORY_GROUPS.INDUSTRIAL,
    "Office & Industrial Furniture": CATEGORY_GROUPS.INDUSTRIAL,
    "Electrical Supplies & Services": CATEGORY_GROUPS.INDUSTRIAL,
    "HVAC & Cooling Systems": CATEGORY_GROUPS.INDUSTRIAL,
    "General Trading & Wholesale": CATEGORY_GROUPS.INDUSTRIAL,
    
    "Cleaning & Janitorial Supplies": CATEGORY_GROUPS.SERVICES,
    "Pest Control & Facility Services": CATEGORY_GROUPS.SERVICES,
    "Security & CCTV": CATEGORY_GROUPS.SERVICES,
    "Logistics & Freight": CATEGORY_GROUPS.SERVICES,
    "Signage & Printing": CATEGORY_GROUPS.SERVICES,
  };

  // Assign each category to a group
  categories.forEach(category => {
    const groupName = groupMappings[category.name] || CATEGORY_GROUPS.SERVICES;
    groups[groupName].push(category);
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}

interface CategoriesModalTanstackProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoriesModalTanstack({ isOpen, onClose }: CategoriesModalTanstackProps) {
  // Use the TanStack Query hook to fetch categories
  const { data: categories, isLoading, error } = useCategories();
  
  // Use raw categories or fallback to empty array
  const categoriesData = categories || [];
  
  const categoriesByGroup = isLoading ? {} : categorizeByGroup(categoriesData);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 w-[calc(100%-32px)] sm:w-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">All Categories</DialogTitle>
          <DialogDescription className="text-sm mt-1 max-w-full">
            Browse all available provider categories
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-4 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mb-5">
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center text-muted-foreground">
            Unable to load categories. Please try again later.
          </div>
        ) : (
          <div className="py-2 sm:py-4">
            {Object.entries(categoriesByGroup).map(([groupName, groupCategories]) => (
              <div key={groupName} className="mb-5 sm:mb-8">
                <h3 className="text-base sm:text-lg font-medium mb-3 pb-2 border-b">{groupName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {groupCategories.map(category => (
                    <CategoryCard
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      icon={category.icon}
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
