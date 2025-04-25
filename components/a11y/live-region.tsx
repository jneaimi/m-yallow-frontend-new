"use client";

import React from 'react';

/**
 * LiveRegion Component
 * 
 * Creates a live region for screen reader announcements.
 * This component is used to announce dynamic content changes to screen readers.
 * 
 * @example
 * <LiveRegion>Content that will be announced</LiveRegion>
 * 
 * @example
 * <LiveRegion politeness="assertive">Important alert</LiveRegion>
 */
export function LiveRegion({
  id = 'a11y-live-region',
  politeness = 'polite',
  'aria-atomic': atomic = true,
  'aria-relevant': relevant = 'additions text',
  children,
}: {
  id?: string;
  politeness?: 'assertive' | 'polite';
  'aria-atomic'?: boolean;
  'aria-relevant'?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      id={id}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      style={{
        position: children ? 'relative' : 'absolute',
        width: children ? 'auto' : '1px',
        height: children ? 'auto' : '1px',
        padding: children ? undefined : '0',
        overflow: children ? undefined : 'hidden',
        clip: children ? undefined : 'rect(0, 0, 0, 0)',
        whiteSpace: children ? undefined : 'nowrap',
        border: children ? undefined : '0',
      }}
    >
      {children}
    </div>
  );
}

export default LiveRegion;
