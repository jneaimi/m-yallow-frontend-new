"use client";

import React from "react";
import { getSkipLinkProps } from "@/lib/accessibility/keyboard-navigation";

/**
 * SkipLink Component
 * 
 * Provides keyboard-only users a way to bypass navigation and skip directly to main content.
 * This component is visually hidden until it receives focus, making it only visible to
 * keyboard users who need it.
 * 
 * @param targetId - ID of the element to skip to (defaults to 'main-content')
 * @param className - Additional classes to apply to the component
 */
export function SkipLink({
  targetId = "main-content",
  className = "",
}: {
  targetId?: string;
  className?: string;
}) {
  const defaultProps = getSkipLinkProps(targetId);
  
  return (
    <a
      href={`#${targetId}`}
      className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring focus:rounded-md ${className}`}
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
