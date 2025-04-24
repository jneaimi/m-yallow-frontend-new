"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Breakpoint } from "@/lib/responsive/breakpoints";

export interface ResponsiveContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width breakpoint for the container
   * @default "xl"
   */
  maxWidth?: Breakpoint | "full" | "none";
  
  /**
   * Whether to add horizontal padding 
   * @default true
   */
  padding?: boolean;
  
  /**
   * Center the container horizontally
   * @default true
   */
  center?: boolean;
  
  /**
   * Whether to add horizontal padding on small screens
   * @default true
   */
  mobilePadding?: boolean;
}

/**
 * A responsive container component that adapts to different screen sizes.
 * Sets max-width based on breakpoints and handles consistent padding.
 */
export function ResponsiveContainer({
  children,
  className,
  maxWidth = "xl",
  padding = true,
  center = true,
  mobilePadding = true,
  ...props
}: ResponsiveContainerProps) {
  // Generate max-width class based on the maxWidth prop
  const maxWidthClass = (() => {
    switch (maxWidth) {
      case "xs":
        return "max-w-screen-xs";
      case "sm":
        return "max-w-screen-sm";
      case "md":
        return "max-w-screen-md";
      case "lg":
        return "max-w-screen-lg";
      case "xl":
        return "max-w-screen-xl";
      case "2xl":
        return "max-w-screen-2xl";
      case "full":
        return "max-w-full";
      case "none":
        return "";
      default:
        return "max-w-screen-xl";
    }
  })();

  return (
    <div
      className={cn(
        // Apply max-width based on prop
        maxWidthClass,
        // Center if requested
        center && "mx-auto",
        // Apply horizontal padding
        padding && mobilePadding && "px-4 sm:px-6 md:px-8",
        // Apply only on larger screens if mobilePadding is false
        padding && !mobilePadding && "px-0 sm:px-6 md:px-8",
        // Allow for custom classes
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
