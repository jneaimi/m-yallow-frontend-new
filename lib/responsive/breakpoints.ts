/**
 * Responsive breakpoints for the application.
 * These match Tailwind's default breakpoints to ensure consistency.
 */
export const breakpoints = {
  xs: '320px',   // Extra small devices (phones)
  sm: '640px',   // Small devices (large phones, small tablets)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (laptops/desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px' // Very large screens
};

/**
 * Breakpoints as numbers (in pixels) for programmatic use
 */
export const breakpointValues = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Breakpoint keys for type safety
 */
export type Breakpoint = keyof typeof breakpoints;
