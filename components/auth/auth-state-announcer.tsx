/**
 * Authentication state announcer component
 * Provides screen reader announcements for auth state changes
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { LiveRegion } from "@/components/a11y/live-region";
import { announceAuthStateChange } from "@/lib/accessibility/auth";
import { announce } from "@/lib/accessibility";

export function AuthStateAnnouncer() {
  const { isLoaded, isSignedIn } = useAuth();
  const [prevSignedIn, setPrevSignedIn] = useState<boolean | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");

  useEffect(() => {
    // Only announce changes after initial load and when the state actually changes
    if (isLoaded && prevSignedIn !== null && prevSignedIn !== isSignedIn) {
      // Use the announcement state instead of DOM manipulation
      const message = isSignedIn
        ? "You have successfully signed in"
        : "You have been signed out";

      setAnnouncement(message);
      // Could also use the announceAuthStateChange utility here if needed
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
      aria-atomic={true}
    >
      {announcement}
    </LiveRegion>
  );
}
