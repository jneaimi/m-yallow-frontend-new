"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { ViewAllCategoriesButton } from "./view-all-categories-button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CategoriesCarouselProps {
  categories: Category[];
  onViewAllClick: () => void;
  className?: string;
}

export function CategoriesCarousel({ 
  categories, 
  onViewAllClick,
  className 
}: CategoriesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Hook to track window size for responsive design
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Handle window resize
  React.useEffect(() => {
    // Set initial window width only on client-side
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Number of categories to show per slide based on window width
  const getItemsPerSlide = () => {
    // During SSR or initial render, default to a reasonable value
    if (windowWidth === 0) return 4;
    
    if (windowWidth >= 1280) return 6;      // xl - Extra large screens
    if (windowWidth >= 1024) return 5;      // lg - Large screens
    if (windowWidth >= 768) return 4;       // md - Medium screens
    if (windowWidth >= 640) return 3;       // sm - Small screens
    return 2;                               // xs - Mobile
  };
  
  const itemsToShow = getItemsPerSlide();
  
  // Calculate the total number of slides
  const totalSlides = Math.ceil(categories.length / itemsToShow);
  
  // Go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };
  
  // Get the categories to display in the current slide
  const displayCategories = () => {
    const start = currentIndex * itemsToShow;
    return categories.slice(start, start + itemsToShow);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={prevSlide}
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-9 w-9"
            onClick={nextSlide}
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="mx-2 flex items-center">
            {/* Client-side only: Render indicators after hydration */}
            {typeof window !== 'undefined' && windowWidth > 0 && 
              Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full mx-1 transition-all",
                    index === currentIndex ? "bg-primary" : "bg-gray-300"
                  )}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))
            }
          </div>
        </div>
        
        <ViewAllCategoriesButton 
          onViewAllClick={onViewAllClick}
          totalCategories={categories.length}
        />
      </div>
      
      {/* Categories Display with smooth transition */}
      <div className="overflow-hidden">
        <div 
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-all duration-300`}
        >
          {displayCategories().map((category) => (
          <Link
            key={category.id}
            href={`/providers/category/${encodeURIComponent(category.id)}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="h-full">
              <CardContent className="flex flex-col items-center text-center p-3 space-y-2">
                <div className="text-primary p-2 rounded-full bg-primary/10">
                  {category.icon}
                </div>
                <h3 className="font-medium text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
