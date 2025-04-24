/**
 * Accessibility utilities for authentication redirects
 */

/**
 * Generate accessible redirect data for client-side handling
 * @param redirectUrl URL to redirect to after authentication
 * @returns Object with redirect data and accessibility properties
 */
export function getAccessibleRedirectData(redirectUrl: string | null) {
  return {
    redirectUrl: redirectUrl || "/dashboard",
    accessibilityAnnouncement: "Authentication required. Redirecting to sign in page.",
    focusElementId: "sign-in-email", // ID of the element to focus after redirect
    ariaLiveMessage: "Please sign in to continue to the requested page."
  };
}

/**
 * Create a URL with accessibility parameters for redirects
 * @param baseUrl Base URL for the redirect
 * @param originalUrl Original URL the user was trying to access
 * @returns URL with added accessibility parameters
 */
export function createAccessibleRedirectUrl(baseUrl: string, originalUrl: string) {
  const url = new URL(baseUrl);
  
  // Add the original URL as a redirect parameter
  url.searchParams.set("redirect_url", originalUrl);
  
  // Add a parameter to trigger focus management
  url.searchParams.set("manage_focus", "true");
  
  // Add a parameter for screen reader announcement
  url.searchParams.set("announce", "auth_required");
  
  return url.toString();
}

/**
 * Handle focus management after authentication redirect
 * @param focusElementId ID of the element to focus
 * @param fallbackSelector Fallback selector if element with ID is not found
 */
export function manageFocusAfterRedirect(focusElementId: string = "sign-in-email", fallbackSelector: string = "form input:first-of-type") {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    // Try to find element by ID first
    const elementToFocus = document.getElementById(focusElementId);
    
    if (elementToFocus) {
      elementToFocus.focus();
      return;
    }
    
    // Fall back to selector if ID not found
    const fallbackElement = document.querySelector(fallbackSelector) as HTMLElement;
    if (fallbackElement) {
      fallbackElement.focus();
    }
  }, 100);
}

/**
 * Announce authentication redirect to screen readers
 * @param message Message to announce
 * @param politeness ARIA live region politeness (polite or assertive)
 */
export function announceAuthRedirect(message: string = "Authentication required. Please sign in.", politeness: "polite" | "assertive" = "polite") {
  // Use the appropriate announcer based on politeness
  const announcerId = politeness === "assertive" ? "a11y-announcer-assertive" : "auth-state-announcer";
  
  const announcer = document.getElementById(announcerId);
  if (announcer) {
    announcer.textContent = message;
  }
}
