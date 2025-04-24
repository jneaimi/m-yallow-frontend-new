/**
 * Focus Management Utilities
 * 
 * Provides hooks and utilities for managing focus states
 * and keyboard-only focus indicators.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook to detect if the user is navigating with keyboard
 * This helps show focus indicators only for keyboard users
 * 
 * @returns Object containing information about keyboard navigation
 */
export function useKeyboardNavigation() {
  const [isNavigatingWithKeyboard, setIsNavigatingWithKeyboard] = useState(false);
  
  useEffect(() => {
    // Handler for keyboard navigation detection
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsNavigatingWithKeyboard(true);
      }
    };
    
    // Handler for mouse use detection
    const handleMouseDown = () => {
      setIsNavigatingWithKeyboard(false);
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return { isNavigatingWithKeyboard };
}

/**
 * Hook to manage focus state of an element
 * 
 * @param options Configuration options
 * @returns Object with focus state and ref
 */
export function useFocusState(
  options: {
    initialFocused?: boolean;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
  } = {}
) {
  const { initialFocused = false, onFocus, onBlur } = options;
  const [isFocused, setIsFocused] = useState(initialFocused);
  const ref = useRef<HTMLElement>(null);
  
  const handleFocus = useCallback((event: React.FocusEvent) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);
  
  const handleBlur = useCallback((event: React.FocusEvent) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);
  
  const focus = useCallback(() => {
    ref.current?.focus();
  }, []);
  
  const blur = useCallback(() => {
    ref.current?.blur();
  }, []);
  
  // Get props to spread onto the target element
  const getFocusProps = useCallback(() => {
    return {
      ref,
      onFocus: handleFocus,
      onBlur: handleBlur,
    };
  }, [handleFocus, handleBlur]);
  
  return {
    isFocused,
    focus,
    blur,
    ref,
    getFocusProps,
  };
}

/**
 * Hook to control focus visibility based on user interaction method
 * Shows focus rings only when navigating with keyboard, not with mouse
 * 
 * @returns CSS class to apply for focus visibility
 */
export function useFocusVisibility() {
  const { isNavigatingWithKeyboard } = useKeyboardNavigation();
  
  // These classes can be used to control focus visibility
  const focusVisibilityClass = isNavigatingWithKeyboard
    ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2'
    : 'focus:outline-none';
  
  // Add a global style to hide focus outlines when not navigating with keyboard
  useEffect(() => {
    // Only add the style once on mount
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        /* Only show focus styles when navigating with keyboard */
        .js-focus-visible :focus:not(.focus-visible) {
          outline: none;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, []);
  
  return { focusVisibilityClass, isNavigatingWithKeyboard };
}

/**
 * Hook to restore focus to an element when a component unmounts
 * Useful for modals, popovers, and other temporary UI elements
 * 
 * @param elementToFocus Element to focus when component unmounts
 */
export function useRestoreFocus(elementToFocus?: HTMLElement | null) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Save currently focused element on mount
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Restore focus on unmount
    return () => {
      const elementToRestore = elementToFocus || previousFocusRef.current;
      
      if (elementToRestore && typeof elementToRestore.focus === 'function') {
        // Small delay to ensure the DOM has settled
        setTimeout(() => {
          elementToRestore.focus();
        }, 0);
      }
    };
  }, [elementToFocus]);
}

/**
 * Creates class names for focus states with appropriate visibility
 * 
 * @param isNavigatingWithKeyboard Whether user is navigating with keyboard
 * @returns Object with different focus-related class names
 */
export function getFocusStateClasses(isNavigatingWithKeyboard: boolean = true) {
  return {
    // Use for all interactive elements
    focusRing: isNavigatingWithKeyboard
      ? 'focus:ring-2 focus:ring-ring focus:ring-offset-2'
      : 'focus:outline-none',
    
    // Use for elements that should have more prominent focus
    focusOutline: isNavigatingWithKeyboard
      ? 'focus:outline-2 focus:outline-ring focus:outline-offset-2'
      : 'focus:outline-none',
    
    // Use for elements that should have subtle focus
    focusSubtle: isNavigatingWithKeyboard
      ? 'focus:ring-1 focus:ring-ring/50'
      : 'focus:outline-none',
  };
}
