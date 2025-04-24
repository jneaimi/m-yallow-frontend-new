"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Breakpoint } from "@/lib/responsive/breakpoints";
import { useActiveBreakpoint } from "@/hooks/use-breakpoint";

export interface ResponsiveWrapperProps {
  /**
   * The content to render at each breakpoint
   */
  children: React.ReactNode;
  
  /**
   * Component to render at specific breakpoints
   */
  xs?: React.ReactNode;
  sm?: React.ReactNode;
  md?: React.ReactNode;
  lg?: React.ReactNode;
  xl?: React.ReactNode;
  "2xl"?: React.ReactNode;
  
  /**
   * Whether to render on the server for the default breakpoint
   * When false, nothing will be rendered during SSR
   * @default true
   */
  ssr?: boolean;
  
  /**
   * Default breakpoint to use for SSR
   * @default "md"
   */
  defaultBreakpoint?: Breakpoint;
}

/**
 * A wrapper component that renders different content based on the current breakpoint.
 * Useful for completely different layouts or components at different screen sizes.
 */
export function ResponsiveWrapper({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
  ssr = true,
  defaultBreakpoint = "md",
}: ResponsiveWrapperProps) {
  const [mounted, setMounted] = React.useState(false);
  const activeBreakpoint = useActiveBreakpoint();
  
  // Set mounted state when component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle SSR case
  if (!mounted) {
    // If SSR is disabled, render nothing
    if (!ssr) return null;
    
    // Otherwise, render the default breakpoint content
    switch (defaultBreakpoint) {
      case "xs": return xs || children;
      case "sm": return sm || xs || children;
      case "md": return md || sm || xs || children;
      case "lg": return lg || md || sm || xs || children;
      case "xl": return xl || lg || md || sm || xs || children;
      case "2xl": return xxl || xl || lg || md || sm || xs || children;
      default: return children;
    }
  }
  
  // Client-side rendering based on active breakpoint
  switch (activeBreakpoint) {
    case "2xl": return xxl || xl || lg || md || sm || xs || children;
    case "xl": return xl || lg || md || sm || xs || children;
    case "lg": return lg || md || sm || xs || children;
    case "md": return md || sm || xs || children;
    case "sm": return sm || xs || children;
    case "xs": return xs || children;
    default: return children;
  }
}

/**
 * Renders a component only when the viewport matches certain conditions
 */
export interface ResponsiveRenderProps {
  /**
   * Render when viewport is at least this breakpoint
   */
  from?: Breakpoint;
  
  /**
   * Render when viewport is at most this breakpoint
   */
  until?: Breakpoint;
  
  /**
   * The content to render when conditions are met
   */
  children: React.ReactNode;
  
  /**
   * Content to render when conditions are not met (fallback)
   */
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders content based on viewport size
 */
export function ResponsiveRender({
  from,
  until,
  children,
  fallback = null,
}: ResponsiveRenderProps) {
  const [mounted, setMounted] = React.useState(false);
  const activeBreakpoint = useActiveBreakpoint();
  const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
  
  // Set mounted state when component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Not mounted yet, render nothing server-side to avoid hydration mismatches
  if (!mounted) {
    return null;
  }
  
  // Get indices for comparison
  const fromIndex = from ? breakpointOrder.indexOf(from) : 0;
  const untilIndex = until ? breakpointOrder.indexOf(until) : breakpointOrder.length - 1;
  const currentIndex = breakpointOrder.indexOf(activeBreakpoint);
  
  // Check if current breakpoint is within the specified range
  const isInRange = currentIndex >= fromIndex && currentIndex <= untilIndex;
  
  // Render the appropriate content
  return isInRange ? <>{children}</> : <>{fallback}</>;
}
