/**
 * Screen Reader and Announcement Utilities
 * 
 * Provides utilities for creating accessible announcements
 * for screen readers and managing live regions.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Creates an announcement that will be read by screen readers
 * 
 * @param message The message to announce
 * @param politeness The politeness level of the announcement
 */
export function announce(
  message: string,
  politeness: 'assertive' | 'polite' = 'polite'
): void {
  // Check if we already have an announcement element
  let announcementElement = document.getElementById('a11y-announcement');
  
  // Create element if it doesn't exist
  if (!announcementElement) {
    announcementElement = document.createElement('div');
    announcementElement.id = 'a11y-announcement';
    announcementElement.setAttribute('aria-live', politeness);
    announcementElement.setAttribute('aria-atomic', 'true');
    announcementElement.style.position = 'absolute';
    announcementElement.style.width = '1px';
    announcementElement.style.height = '1px';
    announcementElement.style.padding = '0';
    announcementElement.style.overflow = 'hidden';
    announcementElement.style.clip = 'rect(0, 0, 0, 0)';
    announcementElement.style.whiteSpace = 'nowrap';
    announcementElement.style.border = '0';
    
    document.body.appendChild(announcementElement);
  } else {
    // Update politeness if different
    announcementElement.setAttribute('aria-live', politeness);
  }
  
  // Clear previous announcement
  announcementElement.textContent = '';
  
  // Small delay to ensure screen readers register the change
  setTimeout(() => {
    announcementElement!.textContent = message;
  }, 50);
}

/**
 * Hook for managing screen reader announcements
 * 
 * @param options Configuration options
 * @returns Methods for triggering announcements
 */
export function useAnnouncement(
  options: {
    politeness?: 'assertive' | 'polite';
  } = {}
) {
  const { politeness = 'polite' } = options;
  
  const announce = useRef((message: string, polite?: 'assertive' | 'polite') => {
    const politenessLevel = polite || politeness;
    
    // Call the global announce function
    window.setTimeout(() => {
      announceMessage(message, politenessLevel);
    }, 50);
  }).current;
  
  return {
    announce,
    announceAssertive: (message: string) => announce(message, 'assertive'),
    announcePolite: (message: string) => announce(message, 'polite'),
  };
}

/**
 * Hook for creating a status message that will be announced to screen readers
 */
export function useStatus(
  initialStatus: string = '',
  options: {
    politeness?: 'assertive' | 'polite';
    announceOnChange?: boolean;
  } = {}
) {
  const { 
    politeness = 'polite',
    announceOnChange = true
  } = options;
  
  const [status, setStatus] = useState(initialStatus);
  
  // Announce status changes
  useEffect(() => {
    if (status && announceOnChange) {
      announce(status, politeness);
    }
  }, [status, politeness, announceOnChange]);
  
  return [status, setStatus] as const;
}

// Alias for the announce function (used internally)
const announceMessage = announce;
