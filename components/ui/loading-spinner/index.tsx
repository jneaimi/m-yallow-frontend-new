'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 24, 
  className = '', 
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-primary mr-2" style={{ height: `${size/8}rem`, width: `${size/8}rem` }} />
      {text && <span>{text}</span>}
    </div>
  );
}
