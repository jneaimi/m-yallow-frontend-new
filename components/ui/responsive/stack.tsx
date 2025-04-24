"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction to stack items
   * @default "vertical"
   */
  direction?: "horizontal" | "vertical";
  
  /**
   * Switch to horizontal layout at specific breakpoint
   */
  switchToHorizontalAt?: "sm" | "md" | "lg" | "xl" | "never";
  
  /**
   * Switch to vertical layout at specific breakpoint
   */
  switchToVerticalAt?: "sm" | "md" | "lg" | "xl" | "never";
  
  /**
   * Space between items
   * @default "4"
   */
  spacing?: "0" | "1" | "2" | "4" | "6" | "8" | "12" | "16";
  
  /**
   * Align items along the cross axis
   */
  align?: "start" | "center" | "end" | "stretch";
  
  /**
   * Justify content along the main axis
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  
  /**
   * Make child items take up equal space
   * @default false
   */
  equalSize?: boolean;
}

/**
 * A responsive stack component that arranges children vertically or horizontally.
 * Can responsively switch directions at different breakpoints.
 */
export function ResponsiveStack({
  className,
  children,
  direction = "vertical",
  switchToHorizontalAt = "never",
  switchToVerticalAt = "never",
  spacing = "4",
  align,
  justify,
  equalSize = false,
  ...props
}: ResponsiveStackProps) {
  // Ensure we don't have conflicting configurations
  if (switchToHorizontalAt !== "never" && switchToVerticalAt !== "never") {
    console.warn(
      "ResponsiveStack: You've set both switchToHorizontalAt and switchToVerticalAt. " +
      "This can lead to conflicts. Consider using only one."
    );
  }

  // Default flex direction based on the direction prop
  const baseDirection = direction === "vertical" ? "flex-col" : "flex-row";

  // Class for switching to horizontal layout at a breakpoint
  const switchHorizontalClass = switchToHorizontalAt !== "never"
    ? `${switchToHorizontalAt}:flex-row`
    : "";

  // Class for switching to vertical layout at a breakpoint
  const switchVerticalClass = switchToVerticalAt !== "never"
    ? `${switchToVerticalAt}:flex-col`
    : "";

  // Space between items
  const spacingMap: Record<string, string> = {
    "0": "gap-0",
    "1": "gap-1",
    "2": "gap-2",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
    "12": "gap-12",
    "16": "gap-16",
  };
  const spacingClass = spacingMap[spacing] || "gap-4";

  // Alignment classes
  const alignMap: Record<string, string> = {
    "start": "items-start",
    "center": "items-center",
    "end": "items-end",
    "stretch": "items-stretch",
  };
  const alignClass = align ? alignMap[align] : "";

  // Justify classes
  const justifyMap: Record<string, string> = {
    "start": "justify-start",
    "center": "justify-center",
    "end": "justify-end",
    "between": "justify-between",
    "around": "justify-around",
    "evenly": "justify-evenly",
  };
  const justifyClass = justify ? justifyMap[justify] : "";

  // Equal size class
  const equalSizeClass = equalSize ? "children:flex-1" : "";

  return (
    <div
      className={cn(
        "flex",
        baseDirection,
        switchHorizontalClass,
        switchVerticalClass,
        spacingClass,
        alignClass,
        justifyClass,
        equalSizeClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
