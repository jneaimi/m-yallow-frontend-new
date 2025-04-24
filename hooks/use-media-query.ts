"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting if a media query matches.
 * 
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * // Check if screen is at least medium size
 * const isMediumScreen = useMediaQuery('(min-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    // Create the media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQuery.matches);

    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  // Return false during SSR, actual value after mount
  return mounted ? matches : false;
}

/**
 * Hook to detect when screen is larger than a specific width.
 * 
 * @param width - minimum width in pixels
 * @returns boolean indicating if screen is at least that wide
 * 
 * @example
 * // Check if screen is at least tablet size
 * const isTabletOrLarger = useMinWidth(768);
 */
export function useMinWidth(width: number): boolean {
  return useMediaQuery(`(min-width: ${width}px)`);
}

/**
 * Hook to detect when screen is smaller than a specific width.
 * 
 * @param width - maximum width in pixels
 * @returns boolean indicating if screen is at most that wide
 * 
 * @example
 * // Check if screen is mobile sized
 * const isMobile = useMaxWidth(639);
 */
export function useMaxWidth(width: number): boolean {
  return useMediaQuery(`(max-width: ${width}px)`);
}
