"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns on mobile (default)
   * @default 1
   */
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  
  /**
   * Number of columns on small screens
   */
  smCols?: 1 | 2 | 3 | 4 | 6 | 12;
  
  /**
   * Number of columns on medium screens
   */
  mdCols?: 1 | 2 | 3 | 4 | 6 | 12;
  
  /**
   * Number of columns on large screens
   */
  lgCols?: 1 | 2 | 3 | 4 | 6 | 12;
  
  /**
   * Number of columns on extra large screens
   */
  xlCols?: 1 | 2 | 3 | 4 | 6 | 12;
  
  /**
   * Gap between grid items
   * @default "4"
   */
  gap?: "0" | "1" | "2" | "4" | "6" | "8" | "12" | "16";
}

/**
 * A responsive grid component that adapts columns based on screen size.
 * Uses CSS Grid for layout with configurable columns at different breakpoints.
 */
export function ResponsiveGrid({
  className,
  children,
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  xlCols,
  gap = "4",
  ...props
}: ResponsiveGridProps) {
  // Map numbers to tailwind grid column classes
  const getColsClass = (colValue: number | undefined) => {
    if (!colValue) return "";
    const colMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };
    return colMap[colValue] || "";
  };

  // Map breakpoints to tailwind responsive prefixes
  const getResponsiveColsClass = (
    breakpoint: "sm" | "md" | "lg" | "xl",
    colValue: number | undefined
  ) => {
    if (!colValue) return "";
    const colMap: Record<number, string> = {
      1: `${breakpoint}:grid-cols-1`,
      2: `${breakpoint}:grid-cols-2`,
      3: `${breakpoint}:grid-cols-3`,
      4: `${breakpoint}:grid-cols-4`,
      6: `${breakpoint}:grid-cols-6`,
      12: `${breakpoint}:grid-cols-12`,
    };
    return colMap[colValue] || "";
  };

  // Map gap values to tailwind gap classes
  const getGapClass = (gapValue: string) => {
    const gapMap: Record<string, string> = {
      "0": "gap-0",
      "1": "gap-1",
      "2": "gap-2",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
      "12": "gap-12",
      "16": "gap-16",
    };
    return gapMap[gapValue] || "gap-4";
  };

  return (
    <div
      className={cn(
        "grid",
        getColsClass(cols),
        getResponsiveColsClass("sm", smCols),
        getResponsiveColsClass("md", mdCols),
        getResponsiveColsClass("lg", lgCols),
        getResponsiveColsClass("xl", xlCols),
        getGapClass(gap),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
