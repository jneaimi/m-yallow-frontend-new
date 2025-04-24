/**
 * Component to handle authentication redirects with accessibility features
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { manageFocusAfterRedirect, announceAuthRedirect } from '@/lib/accessibility/auth-redirects';

/**
 * Component that handles accessibility concerns after authentication redirects
 * - Manages focus on appropriate form elements
 * - Announces redirect reason to screen readers
 * - Preserves redirect URL for post-authentication navigation
 */
export function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if this is a redirect that needs accessibility handling
    const shouldManageFocus = searchParams.get('manage_focus') === 'true';
    const announceType = searchParams.get('announce');
    
    if (shouldManageFocus) {
      // Focus the appropriate element (usually the email input)
      manageFocusAfterRedirect('sign-in-email', 'form input:first-of-type');
    }
    
    if (announceType === 'auth_required') {
      // Announce the authentication requirement to screen readers
      announceAuthRedirect(
        'Authentication required. Please sign in to access the requested page.',
        'polite'
      );
    }
  }, [searchParams]);
  
  // This component doesn't render anything visible
  return null;
}

/**
 * Hook to get the redirect URL from search parameters
 * @returns The URL to redirect to after authentication, or null if none
 */
export function useRedirectUrl(): string | null {
  const searchParams = useSearchParams();
  return searchParams.get('redirect_url');
}
