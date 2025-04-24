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
  const { href, className: defaultClassName, children } = getSkipLinkProps(targetId);
  
  return (
    <a
      href={href}
      className={`${defaultClassName} focus:rounded-md ${className}`}
    >
      {children}
    </a>
  );
}

export default SkipLink;
