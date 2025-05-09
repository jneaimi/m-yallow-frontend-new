"use client";

import React, { useState } from "react";
import { CategoriesCarousel } from "./categories-carousel";
import { CategoriesModalTanstack } from "./categories-modal-tanstack";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface HybridCategoriesTanstackProps {
  categories: Category[];
  className?: string;
}

export function HybridCategoriesTanstack({ categories, className }: HybridCategoriesTanstackProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Function to select featured categories
  const getFeaturedCategories = () => {
    // If we have fewer than 12 categories, just return them all
    if (categories.length <= 12) {
      return categories;
    }
    
    // Map of category names that we want to feature
    // Prioritizing common industrial categories that users are likely to search for
    const priorityCategories = new Set([
      "Building Materials Suppliers",
      "Car Maintenance & Repair",
      "Construction Companies",
      "Electrical Supplies & Services",
      "HVAC & Cooling Systems",
      "Plumbing & Sanitary Ware",
      "Power Tools & Equipment",
      "Security & CCTV",
      "Steel & Metal Works",
      "Warehouse & Storage",
      "Welding & Fabrication",
      "Auto Spare Parts"
    ]);
    
    // Filter categories by priority names
    const featured = categories.filter(cat => priorityCategories.has(cat.name));
    
    // If we couldn't find enough priority categories, add more until we have at least 12
    if (featured.length < 12 && categories.length > 12) {
      const remaining = categories.filter(cat => !priorityCategories.has(cat.name));
      return [...featured, ...remaining.slice(0, 12 - featured.length)];
    }
    
    return featured;
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <CategoriesCarousel 
        categories={getFeaturedCategories()} 
        onViewAllClick={openModal}
        className={className}
      />
      
      <CategoriesModalTanstack 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}
