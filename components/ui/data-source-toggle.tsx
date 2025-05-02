'use client';

import { useState } from 'react';
import { useUser } from '@/lib/context/user-context';
import { UserDataSource } from '@/lib/context/user-context-config';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export function DataSourceToggle({ className = '' }: { className?: string }) {
  const { currentDataSource, setDataSource, refreshUser } = useUser();
  const [isTogglingSource, setIsTogglingSource] = useState(false);

  const handleToggleSource = async () => {
    setIsTogglingSource(true);
    try {
      const newSource: UserDataSource = currentDataSource === 'backend' ? 'clerk' : 'backend';
      setDataSource(newSource);
      await refreshUser();
    } finally {
      setIsTogglingSource(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="grid gap-1.5 leading-none">
        <div className="flex items-center space-x-2">
          <Label htmlFor="data-source-toggle" className="text-sm font-medium">
            Data Source: {currentDataSource === 'backend' ? 'Backend API' : 'Clerk'}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Toggle between using the backend API or Clerk as the data source for user information.
                  This is primarily for development and debugging purposes.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-xs text-muted-foreground">
          Switch between backend and Clerk data sources
        </span>
      </div>
      <Switch
        id="data-source-toggle"
        checked={currentDataSource === 'backend'}
        onCheckedChange={handleToggleSource}
        disabled={isTogglingSource}
      />
    </div>
  );
}
