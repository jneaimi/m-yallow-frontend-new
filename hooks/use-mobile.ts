'use client';

import { useState, useEffect } from 'react';

/**
 * A hook that provides information about the current device viewport size.
 * 
 * @param mobileBreakpoint - The maximum width in pixels to be considered a mobile device
 * @param tabletBreakpoint - The maximum width in pixels to be considered a tablet device
 * @returns An object with boolean flags for different device types and the current width
 */
export function useMobile(mobileBreakpoint = 640, tabletBreakpoint = 1024) {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Initial call to set the window size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute device type based on window width
  const isMobile = Boolean(windowSize.width && windowSize.width < mobileBreakpoint);
  const isTablet = Boolean(
    windowSize.width && 
    windowSize.width >= mobileBreakpoint && 
    windowSize.width < tabletBreakpoint
  );
  const isDesktop = Boolean(windowSize.width && windowSize.width >= tabletBreakpoint);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
  };
}
