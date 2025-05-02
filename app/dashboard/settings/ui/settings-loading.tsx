'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SettingsLoadingProps {
  text?: string;
}

/**
 * Loading component for settings pages
 */
export function SettingsLoading({ text = "Loading your settings..." }: SettingsLoadingProps) {
  return (
    <div className="container py-8 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <LoadingSpinner size={32} text={text} className="flex-col" />
      </div>
    </div>
  );
}
