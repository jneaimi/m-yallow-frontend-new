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
      <Loader2 className={`h-${size/8} w-${size/8} animate-spin text-primary mr-2`} />
      {text && <span>{text}</span>}
    </div>
  );
}
