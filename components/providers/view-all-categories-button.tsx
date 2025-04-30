"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewAllCategoriesButtonProps {
  onViewAllClick: () => void;
  totalCategories?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'text-only';
}

export function ViewAllCategoriesButton({ 
  onViewAllClick, 
  totalCategories, 
  className,
  variant = 'default'
}: ViewAllCategoriesButtonProps) {
  // Handle different button variants
  const getButtonStyle = () => {
    switch(variant) {
      case 'compact':
        return "py-1.5 px-3 text-sm";
      case 'text-only':
        return "bg-transparent hover:bg-transparent hover:underline p-0";
      default:
        return "";
    }
  };
  
  return (
    <div className={cn(
      "flex items-center justify-end",
      // Responsive positioning classes
      "w-full sm:w-auto",
      className
    )}>
      {/* Mobile (below sm breakpoint): Full width button */}
      <Button 
        variant={variant === 'text-only' ? 'link' : 'outline'} 
        className={cn(
          "gap-2 w-full justify-center sm:w-auto transition-all",
          getButtonStyle(),
          // Hide on larger screens
          "flex sm:hidden",
          // Make it more prominent on mobile
          "border border-primary/30 hover:bg-primary/5",
          // Add a nice shadow effect on hover
          "hover:shadow-sm"
        )}
        onClick={onViewAllClick}
        aria-label="View all categories"
      >
        <Grid2X2 className="h-4 w-4 text-primary" />
        <span>View All Categories</span>
      </Button>

      {/* Small screens (sm): Compact button */}
      <Button 
        variant={variant === 'text-only' ? 'link' : 'ghost'} 
        className={cn(
          "gap-2 transition-all",
          getButtonStyle(),
          // Only visible on sm screens
          "hidden sm:flex md:hidden",
          "hover:bg-primary/5"
        )}
        onClick={onViewAllClick}
        aria-label="View all categories"
      >
        <Grid2X2 className="h-4 w-4" />
        <span>View All</span>
      </Button>

      {/* Medium screens and above (md+): Full button with count */}
      <Button 
        variant={variant === 'text-only' ? 'link' : 'ghost'} 
        className={cn(
          "gap-2 transition-all",
          getButtonStyle(),
          // Only visible on md and larger screens
          "hidden md:flex",
          // Add a slight hover effect for better feedback
          "hover:bg-primary/5"
        )}
        onClick={onViewAllClick}
        aria-label="View all categories"
      >
        <Grid2X2 className="h-4 w-4" />
        <span className="font-medium">
          View All{totalCategories ? ` (${totalCategories})` : ''}
        </span>
      </Button>
    </div>
  );
}
