/**
 * Accessibility Helpers for ARIA Attributes
 * 
 * This file provides utility functions for common ARIA attribute patterns
 * to ensure consistent implementation across components.
 */

/**
 * Get appropriate ARIA attributes for icon-only buttons
 * 
 * @param hasVisibleText Whether the button has visible text content
 * @param ariaLabel Optional explicit aria-label to use
 * @returns Object with appropriate ARIA attributes
 */
export function getIconButtonProps(
  hasVisibleText: boolean, 
  ariaLabel?: string
): Record<string, string> {
  if (!hasVisibleText && ariaLabel) {
    return { 'aria-label': ariaLabel };
  }
  
  if (!hasVisibleText) {
    return { 'aria-label': 'Button' }; // Fallback label
  }
  
  return {}; // No aria-label needed if button has visible text
}

/**
 * Get appropriate ARIA attributes for toggle buttons
 * 
 * @param isPressed Whether the toggle is in a pressed state
 * @param ariaLabel Optional explicit aria-label to use
 * @returns Object with appropriate ARIA attributes
 */
export function getToggleProps(
  isPressed: boolean,
  ariaLabel?: string
): Record<string, string | boolean> {
  return {
    'aria-pressed': isPressed,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {})
  };
}

/**
 * Get appropriate ARIA attributes for dropdown or menu triggers
 * 
 * @param isExpanded Whether the dropdown is expanded
 * @param controlsId ID of the element being controlled
 * @param popupType Type of popup being controlled (menu, dialog, etc.)
 * @returns Object with appropriate ARIA attributes
 */
export function getExpandableProps(
  isExpanded: boolean,
  controlsId?: string,
  popupType: 'menu' | 'dialog' | 'listbox' | 'tree' | 'grid' = 'menu'
): Record<string, string | boolean> {
  return {
    'aria-expanded': isExpanded,
    'aria-haspopup': popupType,
    ...(controlsId ? { 'aria-controls': controlsId } : {})
  };
}

/**
 * Get appropriate ARIA attributes for form fields
 * 
 * @param id ID of the form field
 * @param isRequired Whether the field is required
 * @param isInvalid Whether the field has an error
 * @param errorId ID of the error message element
 * @returns Object with appropriate ARIA attributes
 */
export function getFormFieldProps(
  id: string,
  isRequired: boolean = false,
  isInvalid: boolean = false,
  errorId?: string
): Record<string, string | boolean> {
  return {
    id,
    'aria-required': isRequired,
    'aria-invalid': isInvalid,
    ...(isInvalid && errorId ? { 'aria-describedby': errorId } : {})
  };
}

/**
 * Get appropriate ARIA attributes for tabs
 * 
 * @param isSelected Whether the tab is selected
 * @param controlsId ID of the panel being controlled
 * @param labelledBy ID of the element labeling the tab
 * @returns Object with appropriate ARIA attributes
 */
export function getTabProps(
  isSelected: boolean,
  controlsId: string,
  labelledBy?: string
): Record<string, string | boolean> {
  return {
    role: 'tab',
    'aria-selected': isSelected,
    'aria-controls': controlsId,
    ...(labelledBy ? { 'aria-labelledby': labelledBy } : {}),
    tabIndex: isSelected ? 0 : -1, // Only the selected tab should be in the tab order
  };
}

/**
 * Get appropriate ARIA attributes for tab panels
 * 
 * @param id ID of the panel
 * @param labelledBy ID of the tab that labels this panel
 * @param hidden Whether the panel is currently hidden
 * @returns Object with appropriate ARIA attributes
 */
export function getTabPanelProps(
  id: string,
  labelledBy: string,
  hidden: boolean = false
): Record<string, string | boolean> {
  return {
    id,
    role: 'tabpanel',
    'aria-labelledby': labelledBy,
    hidden,
    tabIndex: hidden ? -1 : 0,
  };
}

/**
 * Get appropriate ARIA attributes for dialogs
 * 
 * @param labelledBy ID of the element that labels the dialog
 * @param describedBy ID of the element that describes the dialog
 * @param isModal Whether the dialog is modal
 * @returns Object with appropriate ARIA attributes
 */
export function getDialogProps(
  labelledBy?: string,
  describedBy?: string,
  isModal: boolean = true
): Record<string, string | boolean> {
  return {
    role: 'dialog',
    'aria-modal': isModal,
    ...(labelledBy ? { 'aria-labelledby': labelledBy } : {}),
    ...(describedBy ? { 'aria-describedby': describedBy } : {})
  };
}

/**
 * Get appropriate ARIA attributes for navigation items
 * 
 * @param isCurrent Whether this is the current page/location
 * @param currentValue The type of current (page, step, location, etc.)
 * @returns Object with appropriate ARIA attributes
 */
export function getNavItemProps(
  isCurrent: boolean,
  currentValue: 'page' | 'step' | 'location' | 'date' | 'time' = 'page'
): Record<string, string | boolean> {
  if (!isCurrent) return {};
  
  return {
    'aria-current': currentValue
  };
}

/**
 * Detect if an element has visible text content
 * 
 * @param children React children to check
 * @returns Boolean indicating if there is visible text
 */
export function hasVisibleText(children: React.ReactNode): boolean {
  // Simple check for string children
  if (typeof children === 'string' && children.trim() !== '') {
    return true;
  }
  
  // Handle array of children
  if (Array.isArray(children)) {
    return children.some(child => 
      // String content
      (typeof child === 'string' && child.trim() !== '') ||
      // React element that's not marked as sr-only
      (typeof child === 'object' && 
       child !== null && 
       'props' in child && 
       child.props?.className?.includes('sr-only') !== true)
    );
  }
  
  // Single React element that's not marked as sr-only
  if (typeof children === 'object' && 
      children !== null && 
      'props' in children && 
      children.props?.className?.includes('sr-only') !== true) {
    return true;
  }
  
  return false;
}
