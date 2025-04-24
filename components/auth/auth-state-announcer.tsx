/**
 * Authentication state announcer component
 * Provides screen reader announcements for auth state changes
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { LiveRegion } from '@/components/a11y/live-region';

export function AuthStateAnnouncer() {
  const { isLoaded, isSignedIn } = useAuth();
  const [prevSignedIn, setPrevSignedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Only announce changes after initial load and when the state actually changes
    if (isLoaded && prevSignedIn !== null && prevSignedIn !== isSignedIn) {
      // We'll use a separate announcer for auth state changes
      const message = isSignedIn 
        ? 'You have successfully signed in'
        : 'You have been signed out';
        
      const announcer = document.getElementById('auth-state-announcer');
      if (announcer) {
        announcer.textContent = message;
      }
    }
    
    if (isLoaded) {
      setPrevSignedIn(isSignedIn);
    }
  }, [isLoaded, isSignedIn, prevSignedIn]);
  
  // This component doesn't render anything visible
  // It only provides the live region for screen reader announcements
  return (
    <LiveRegion
      id="auth-state-announcer"
      politeness="polite"
      className="sr-only"
      aria-atomic="true"
    />
  );
}
