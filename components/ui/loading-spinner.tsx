'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  text,
  size = 'md',
  className
}: LoadingSpinnerProps) {
  // Define size variants
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div 
      className={cn("flex flex-col items-center justify-center", className)}
      role="status"
      aria-live="polite"
      data-testid="loading-spinner"
    >
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} aria-hidden="true" />
      {text && (
        <span className={cn(
          "mt-2 text-center text-muted-foreground",
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {text}
        </span>
      )}
      <span className="sr-only">{text || "Loading"}</span>
    </div>
  );
}
