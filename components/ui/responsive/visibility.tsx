"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Breakpoint, breakpoints } from "@/lib/responsive/breakpoints";

export interface VisibilityProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children to be conditionally rendered
   */
  children: React.ReactNode;
}

/**
 * Visibility props that can specify breakpoint range
 */
export interface BreakpointVisibilityProps extends VisibilityProps {
  /**
   * The minimum breakpoint (inclusive) to show content
   */
  from?: Breakpoint;

  /**
   * The maximum breakpoint (inclusive) to show content
   */
  until?: Breakpoint;

  /**
   * Whether to use display: none (true) or remove from DOM (false)
   * @default true
   */
  keepInDOM?: boolean;
}

/**
 * Hides content on mobile devices (smaller than 'sm' breakpoint)
 */
export function HideOnMobile({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("hidden sm:block", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Shows content only on mobile devices (smaller than 'sm' breakpoint)
 */
export function ShowOnMobile({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("sm:hidden", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Hides content on tablets (between 'sm' and 'lg' breakpoints)
 */
export function HideOnTablet({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("hidden sm:block lg:hidden", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Shows content only on tablets (between 'sm' and 'lg' breakpoints)
 */
export function ShowOnTablet({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("hidden sm:block lg:hidden", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Hides content on desktop devices (larger than 'lg' breakpoint)
 */
export function HideOnDesktop({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("lg:hidden", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Shows content only on desktop devices (larger than 'lg' breakpoint)
 */
export function ShowOnDesktop({
  children,
  className,
  ...props
}: VisibilityProps) {
  return (
    <div className={cn("hidden lg:block", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Flexibly show content at specific breakpoint ranges
 */
export function Show({
  children,
  className,
  from,
  until,
  keepInDOM = true,
  ...props
}: BreakpointVisibilityProps) {
  // Validate breakpoint values
  if (from && !(from in breakpoints)) {
    console.error(`Invalid 'from' breakpoint: ${from}`);
    return null;
  }
  if (until && !(until in breakpoints)) {
    console.error(`Invalid 'until' breakpoint: ${until}`);
    return null;
  }

  // Ensure logical breakpoint order
  if (from && until) {
    const fromIndex = Object.keys(breakpoints).indexOf(from);
    const untilIndex = Object.keys(breakpoints).indexOf(until);
    if (fromIndex > untilIndex) {
      console.error(
        `'from' breakpoint (${from}) cannot be larger than 'until' breakpoint (${until})`
      );
      return null;
    }
  }
  // Client-side only component for non-keepInDOM mode
  const ClientOnlyShow = () => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    const getMediaQuery = () => {
      if (from && until) {
        return `@media (min-width: ${breakpoints[from]}) and (max-width: ${breakpoints[until]})`;
      }
      if (from) {
        return `@media (min-width: ${breakpoints[from]})`;
      }
      if (until) {
        return `@media (max-width: ${breakpoints[until]})`;
      }
      return "";
    };

    const matches = window.matchMedia(getMediaQuery()).matches;

    if (!matches) return null;

    return <>{children}</>;
  };

  // If not keeping in DOM, use a client-only approach
  if (!keepInDOM) {
    return <ClientOnlyShow />;
  }

  // Otherwise use CSS to hide/show
  let visibilityClasses = "";

  // Both from and until are set
  if (from && until) {
    // Build classes based on breakpoint combinations
    switch (from) {
      case "xs":
        visibilityClasses = "hidden xs:block";
        break;
      case "sm":
        visibilityClasses = "hidden sm:block";
        break;
      case "md":
        visibilityClasses = "hidden md:block";
        break;
      case "lg":
        visibilityClasses = "hidden lg:block";
        break;
      case "xl":
        visibilityClasses = "hidden xl:block";
        break;
      case "2xl":
        visibilityClasses = "hidden 2xl:block";
        break;
    }

    // Add until classes
    switch (until) {
      case "xs":
        visibilityClasses += " sm:hidden";
        break;
      case "sm":
        visibilityClasses += " md:hidden";
        break;
      case "md":
        visibilityClasses += " lg:hidden";
        break;
      case "lg":
        visibilityClasses += " xl:hidden";
        break;
      case "xl":
        visibilityClasses += " 2xl:hidden";
        break;
      // No hidden class needed for 2xl as it's the largest breakpoint
    }
  }
  // Only from is set
  else if (from) {
    switch (from) {
      case "xs":
        visibilityClasses = "hidden xs:block";
        break;
      case "sm":
        visibilityClasses = "hidden sm:block";
        break;
      case "md":
        visibilityClasses = "hidden md:block";
        break;
      case "lg":
        visibilityClasses = "hidden lg:block";
        break;
      case "xl":
        visibilityClasses = "hidden xl:block";
        break;
      case "2xl":
        visibilityClasses = "hidden 2xl:block";
        break;
    }
  }
  // Only until is set
  else if (until) {
    visibilityClasses = "block";
    switch (until) {
      case "xs":
        visibilityClasses += " sm:hidden";
        break;
      case "sm":
        visibilityClasses += " md:hidden";
        break;
      case "md":
        visibilityClasses += " lg:hidden";
        break;
      case "lg":
        visibilityClasses += " xl:hidden";
        break;
      case "xl":
        visibilityClasses += " 2xl:hidden";
        break;
      case "2xl":
        // Already at max breakpoint, no additional class needed
        break;
    }
  }

  return (
    <div className={cn(visibilityClasses, className)} {...props}>
      {children}
    </div>
  );
}
