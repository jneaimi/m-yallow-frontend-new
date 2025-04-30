"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

// Define category groups
const CATEGORY_GROUPS = {
  AUTOMOTIVE: "Automotive",
  CONSTRUCTION: "Construction & Building",
  INDUSTRIAL: "Industrial & Equipment",
  SERVICES: "Services & Maintenance"
};

// Function to assign categories to groups
function categorizeByGroup(categories: Category[]): Record<string, Category[]> {
  const groups: Record<string, Category[]> = {
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

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function CategoriesModal({ isOpen, onClose, categories }: CategoriesModalProps) {
  const categoriesByGroup = categorizeByGroup(categories);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-2xl font-bold">All Categories</DialogTitle>
            <DialogDescription>
              Browse all available provider categories
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="py-4">
          {Object.entries(categoriesByGroup).map(([groupName, groupCategories]) => (
            <div key={groupName} className="mb-8">
              <h3 className="text-lg font-medium mb-4 pb-2 border-b">{groupName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {groupCategories.map(category => (
                  <Link
                    key={category.id}
                    href={`/providers/category/${encodeURIComponent(category.id)}`}
                    className="block transition-transform hover:scale-[1.02]"
                    onClick={onClose}
                  >
                    <Card className="h-full">
                      <CardContent className="flex flex-row items-center p-3 gap-3">
                        <div className="text-primary p-1 rounded-full bg-primary/10 flex-shrink-0">
                          {category.icon}
                        </div>
                        <h4 className="font-medium text-sm">{category.name}</h4>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
