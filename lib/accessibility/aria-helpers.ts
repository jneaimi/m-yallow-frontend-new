/**
 * Accessibility Helpers for ARIA Attributes
 *
 * This file provides utility functions for common ARIA attribute patterns
 * to ensure consistent implementation across components.
 */

import type { ReactNode } from "react";

/**
 * Type for ARIA attributes that can be string, boolean, or number
 */
export type AriaProps = Record<string, string | boolean | number>;

/**
 * Get appropriate ARIA attributes for icon-only buttons
 *
 * @param hasVisibleText Whether the button has visible text content
 * @param ariaLabel Optional explicit aria-label to use
 * @param fallbackLabel Optional fallback label to use when no ariaLabel is provided
 * @returns Object with appropriate ARIA attributes
 */
export function getIconButtonProps(
  hasVisibleText: boolean,
  ariaLabel?: string,
  fallbackLabel: string = "Button"
): AriaProps {
  if (!hasVisibleText && ariaLabel) {
    return { "aria-label": ariaLabel };
  }

  if (!hasVisibleText) {
    // In development, warn about generic labels
    if (process.env.NODE_ENV === "development" && fallbackLabel === "Button") {
      console.warn(
        "Warning: Icon button is using generic fallback label. Provide a descriptive aria-label for better accessibility."
      );
    }
    return { "aria-label": fallbackLabel };
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
): AriaProps {
  return {
    "aria-pressed": isPressed,
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
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
  popupType: "menu" | "dialog" | "listbox" | "tree" | "grid" = "menu"
): AriaProps {
  return {
    "aria-expanded": isExpanded,
    "aria-haspopup": popupType,
    ...(controlsId ? { "aria-controls": controlsId } : {}),
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
): AriaProps {
  return {
    id,
    "aria-required": isRequired,
    "aria-invalid": isInvalid,
    ...(isInvalid && errorId ? { "aria-describedby": errorId } : {}),
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
): AriaProps {
  return {
    role: "tab",
    "aria-selected": isSelected,
    "aria-controls": controlsId,
    ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
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
): AriaProps {
  return {
    id,
    role: "tabpanel",
    "aria-labelledby": labelledBy,
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
): AriaProps {
  return {
    role: "dialog",
    "aria-modal": isModal,
    ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
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
  currentValue: "page" | "step" | "location" | "date" | "time" = "page"
): AriaProps {
  if (!isCurrent) return {};

  return {
    "aria-current": currentValue,
  };
}

/**
 * Detect if an element has visible text content
 *
 * @param children React children to check
 * @returns Boolean indicating if there is visible text
 */
export function hasVisibleText(children: ReactNode): boolean {
  // Simple check for string children
  if (typeof children === "string" && children.trim() !== "") {
    return true;
  }

  // Handle array of children
  if (Array.isArray(children)) {
    return children.some(
      (child) =>
        // String content
        (typeof child === "string" && child.trim() !== "") ||
        // React element that's not marked as sr-only
        (typeof child === "object" &&
          child !== null &&
          "props" in child &&
          child.props?.className?.includes("sr-only") !== true)
    );
  }

  // Single React element that's not marked as sr-only
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children
  ) {
    const props = children.props as any;
    if (!props.className || !props.className.includes("sr-only")) {
      return true;
    }
  }

  return false;
}
