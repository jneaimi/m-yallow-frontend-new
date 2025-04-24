"use client";

import { useMediaQuery } from './use-media-query';
import { breakpointValues, Breakpoint } from '@/lib/responsive/breakpoints';

/**
 * Custom hook to detect if the viewport is at least a specific breakpoint.
 * 
 * @param breakpoint - The breakpoint to check (xs, sm, md, lg, xl, 2xl)
 * @returns boolean indicating if viewport width is at least the breakpoint
 * 
 * @example
 * // Check if viewport is at least medium size
 * const isMediumOrLarger = useBreakpointMatch('md');
 */
export function useBreakpointMatch(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpointValues[breakpoint]}px)`);
}

/**
 * Hook that returns the current active breakpoint.
 * Returns the largest breakpoint that matches the current viewport.
 * 
 * @returns The current breakpoint key
 * 
 * @example
 * const currentBreakpoint = useActiveBreakpoint();
 * // currentBreakpoint might be 'md' on a tablet
 */
export function useActiveBreakpoint(): Breakpoint {
  const is2Xl = useBreakpointMatch('2xl');
  const isXl = useBreakpointMatch('xl');
  const isLg = useBreakpointMatch('lg');
  const isMd = useBreakpointMatch('md');
  const isSm = useBreakpointMatch('sm');
  const isXs = useBreakpointMatch('xs');

  if (is2Xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  if (isXs) return 'xs';
  
  // Default fallback (smaller than xs)
  return 'xs';
}

/**
 * Provides boolean flags for common device categories.
 * 
 * @returns Object with boolean flags for device categories
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useDeviceCategory();
 */
export function useDeviceCategory() {
  const isMobile = useMediaQuery(`(max-width: ${breakpointValues.sm - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${breakpointValues.sm}px) and (max-width: ${breakpointValues.lg - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${breakpointValues.lg}px)`);
  const isLargeDesktop = useMediaQuery(`(min-width: ${breakpointValues.xl}px)`);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop
  };
}
