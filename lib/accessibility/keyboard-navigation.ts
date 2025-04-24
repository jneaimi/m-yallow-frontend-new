/**
 * Keyboard Navigation Utilities
 * 
 * This file provides utility functions and hooks for implementing
 * keyboard navigation in interactive components.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Keys commonly used for keyboard navigation
 */
export const KEYS = {
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
};

/**
 * Hook to manage focus trapping within a container
 * Useful for modal dialogs, dropdown menus, etc.
 * 
 * @param isActive Whether the focus trap is active
 * @param options Configuration options
 * @returns Ref to be attached to the container element
 */
export function useFocusTrap(
  isActive: boolean = true, 
  options: {
    autoFocus?: boolean; // Whether to auto-focus the first element when trap activates
    returnFocusOnDeactivate?: boolean; // Whether to return focus to the previously focused element when trap deactivates
    focusableSelector?: string; // Selector for focusable elements
  } = {}
) {
  const {
    autoFocus = true,
    returnFocusOnDeactivate = true,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  } = options;
  
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Saves the currently focused element when the trap activates
  useEffect(() => {
    if (isActive && returnFocusOnDeactivate) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isActive, returnFocusOnDeactivate]);
  
  // Restores focus when the trap deactivates
  useEffect(() => {
    if (!isActive && returnFocusOnDeactivate && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isActive, returnFocusOnDeactivate]);
  
  // Auto-focus first element when trap activates
  useEffect(() => {
    if (isActive && autoFocus && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        focusableSelector
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isActive, autoFocus, focusableSelector]);
  
  // Handle Tab key navigation to trap focus
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== KEYS.TAB) return;
      
      const focusableElements = Array.from(
        containerRef.current?.querySelectorAll(focusableSelector) || []
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey) {
        // If shift+tab and on first element, move to last element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // If tab and on last element, move to first element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, focusableSelector]);
  
  return containerRef;
}

/**
 * Hook to implement arrow key navigation for items in a list or grid
 * 
 * @param options Configuration options
 * @returns Object with event handlers and state
 */
export function useArrowNavigation<T>(
  options: {
    items: T[];
    initialIndex?: number;
    orientation?: 'vertical' | 'horizontal' | 'both';
    loop?: boolean;
    onSelect?: (item: T, index: number) => void;
    getItemId?: (item: T, index: number) => string;
  }
) {
  const {
    items,
    initialIndex = 0,
    orientation = 'vertical',
    loop = true,
    onSelect,
    getItemId,
  } = options;
  
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  
  // Update active index
  const setActive = useCallback((index: number) => {
    let nextIndex = index;
    
    // Apply looping if enabled
    if (loop) {
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;
    } else {
      // Clamp index within bounds
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= items.length) nextIndex = items.length - 1;
    }
    
    setActiveIndex(nextIndex);
    
    // Call onSelect if provided
    if (onSelect) {
      onSelect(items[nextIndex], nextIndex);
    }
    
    return nextIndex;
  }, [items, loop, onSelect, setActiveIndex]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newIndex = activeIndex;
    
    switch (e.key) {
      case KEYS.ARROW_UP:
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = setActive(activeIndex - 1);
        }
        break;
        
      case KEYS.ARROW_DOWN:
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          newIndex = setActive(activeIndex + 1);
        }
        break;
        
      case KEYS.ARROW_LEFT:
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = setActive(activeIndex - 1);
        }
        break;
        
      case KEYS.ARROW_RIGHT:
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = setActive(activeIndex + 1);
        }
        break;
        
      case KEYS.HOME:
        e.preventDefault();
        newIndex = setActive(0);
        break;
        
      case KEYS.END:
        e.preventDefault();
        newIndex = setActive(items.length - 1);
        break;
        
      default:
        return;
    }
    
    // Focus the active item if possible
    const activeItemId = getItemId?.(items[newIndex], newIndex);
    if (activeItemId) {
      const activeElement = document.getElementById(activeItemId);
      activeElement?.focus();
    }
  }, [activeIndex, items, orientation, getItemId, setActive]);
  
  // Get props for the container element
  const getContainerProps = useCallback(() => {
    return {
      role: orientation === 'horizontal' ? 'menubar' : 'menu',
      onKeyDown: handleKeyDown,
      'aria-orientation': orientation === 'both' ? undefined : orientation,
    };
  }, [orientation, handleKeyDown]);
  
  // Get props for each item
  const getItemProps = useCallback((index: number) => {
    const isActive = index === activeIndex;
    const item = items[index];
    const id = getItemId?.(item, index);
    
    return {
      role: 'menuitem',
      tabIndex: isActive ? 0 : -1,
      'aria-selected': isActive,
      id,
      onClick: () => setActive(index),
    };
  }, [activeIndex, items, getItemId, setActive]);
  
  return {
    activeIndex,
    setActive,
    handleKeyDown,
    getContainerProps,
    getItemProps,
  };
}

/**
 * Hook that adds support for dismissing an element with the Escape key
 * 
 * @param onDismiss Function to call when Escape is pressed
 * @param isEnabled Whether the hook is active
 */
export function useEscapeDismiss(
  onDismiss: () => void,
  isEnabled: boolean = true
) {
  useEffect(() => {
    if (!isEnabled) return;
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === KEYS.ESCAPE) {
        onDismiss();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismiss, isEnabled]);
}

/**
 * Component props for creating a skip link
 * 
 * @returns Props for the skip link element
 */
export function getSkipLinkProps(targetId: string = 'main-content') {
  return {
    href: `#${targetId}`,
    className: "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring",
    children: "Skip to main content",
  };
}
