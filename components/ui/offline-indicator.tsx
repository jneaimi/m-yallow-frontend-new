'use client';

import { useNetworkState } from '@/lib/network-context';
import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const { isOnline, networkState } = useNetworkState();
  const [visible, setVisible] = useState(false);
  
  // Add a slight delay before showing the offline message to avoid flashing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isOnline) {
      timer = setTimeout(() => setVisible(true), 500);
    } else {
      setVisible(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isOnline]);
  
  if (isOnline && !visible) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300 ease-in-out">
      <WifiOff className="h-5 w-5" />
      <div>
        <h4 className="font-medium">You're offline</h4>
        <p className="text-sm opacity-90">
          {networkState === 'offline'
            ? 'Check your internet connection to continue.'
            : 'Your connection is unstable. Some features may be limited.'}
        </p>
      </div>
    </div>
  );
}
