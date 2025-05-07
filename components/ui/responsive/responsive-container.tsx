'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  tabletUp?: boolean;
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

/**
 * A responsive container component that can conditionally render content
 * based on screen size.
 */
export function ResponsiveContainer({
  children,
  className,
  desktopOnly = false,
  mobileOnly = false,
  tabletUp = false,
  mobileBreakpoint = 640, // sm
  tabletBreakpoint = 1024, // lg
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useMobile(mobileBreakpoint, tabletBreakpoint);

  // Determine if content should be rendered based on breakpoint props
  const shouldRender = 
    (desktopOnly && isDesktop) ||
    (mobileOnly && isMobile) ||
    (tabletUp && (isTablet || isDesktop)) ||
    (!desktopOnly && !mobileOnly && !tabletUp);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
