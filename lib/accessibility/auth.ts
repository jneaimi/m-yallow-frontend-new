/**
 * Authentication-specific accessibility utilities
 * Provides helpers for making auth flows accessible
 */

'use client';

/**
 * Announce authentication state changes to screen readers
 * @param message The message to announce
 * @param politeness The ARIA live region politeness (default: 'polite')
 */
export function announceAuthStateChange(
  message: string, 
  politeness: 'polite' | 'assertive' = 'polite'
) {
  const announcerId = politeness === 'assertive' ? 'a11y-announcer-assertive' : 'a11y-announcer';
  const announcer = document.getElementById(announcerId);
  
  if (announcer) {
    announcer.textContent = message;
  }
}

/**
 * Manage focus after authentication actions
 * @param elementId The ID of the element to focus
 * @param fallbackSelector A CSS selector to use as fallback
 */
export function manageFocusAfterAuthAction(
  elementId: string, 
  fallbackSelector?: string
) {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    
    if (element) {
      element.focus();
      return;
    }
    
    if (fallbackSelector) {
      const fallbackElement = document.querySelector(fallbackSelector) as HTMLElement;
      if (fallbackElement) {
        fallbackElement.focus();
      }
    }
  }, 100);
}

/**
 * Get ARIA attributes for authentication forms
 * @param formId Base ID for the form
 * @returns Object with ARIA attributes
 */
export function getAuthFormProps(formId: string) {
  return {
    'aria-labelledby': `${formId}-heading`,
    'aria-describedby': `${formId}-description`,
    'role': 'form',
  };
}

/**
 * Get ARIA attributes for authentication error messages
 * @param inputId The ID of the associated input field
 * @returns Object with ARIA attributes
 */
export function getAuthErrorProps(inputId: string) {
  return {
    id: `${inputId}-error`,
    'aria-live': 'assertive',
    role: 'alert',
  };
}

/**
 * Get ARIA attributes for authentication success messages
 * @param formId The ID of the associated form
 * @returns Object with ARIA attributes
 */
export function getAuthSuccessProps(formId: string) {
  return {
    id: `${formId}-success`,
    'aria-live': 'polite',
  };
}

/**
 * Handle keyboard navigation for authentication forms
 * @param event The keyboard event
 * @param config Configuration options
 */
export function handleAuthFormKeyboardNavigation(
  event: React.KeyboardEvent,
  config: {
    onEscape?: () => void;
    onEnter?: () => void;
  }
) {
  if (event.key === 'Escape' && config.onEscape) {
    config.onEscape();
  } else if (event.key === 'Enter' && config.onEnter) {
    config.onEnter();
  }
}
