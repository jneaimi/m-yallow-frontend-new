'use client';

import { useState } from 'react';
import { useUser } from '@/lib/context/user-context';
import { UserDataSource } from '@/lib/context/user-context-config';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DataSourceToggle({ className = '' }: { className?: string }) {
  const { currentDataSource, setDataSource, refreshUser } = useUser();
  const [isTogglingSource, setIsTogglingSource] = useState(false);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

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
    <div className={className}>
      {currentDataSource === 'clerk' && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Using Clerk Data Source</AlertTitle>
          <AlertDescription>
            You are currently using Clerk as your data source. This is for development purposes only.
            In production, the backend should always be the source of truth.
          </AlertDescription>
        </Alert>
      )}
    
      <div className="flex items-center space-x-2">
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
                    This is for development and debugging purposes only. In production, backend should always be used.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-xs text-muted-foreground">
            DEV MODE ONLY: Switch between backend and Clerk data sources
          </span>
        </div>
        <Switch
          id="data-source-toggle"
          checked={currentDataSource === 'backend'}
          onCheckedChange={handleToggleSource}
          disabled={isTogglingSource}
        />
      </div>
    </div>
  );
}
