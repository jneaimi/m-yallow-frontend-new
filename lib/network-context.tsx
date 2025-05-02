'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Define the NetworkInformation interface that's missing from the standard TypeScript types
interface NetworkInformation extends EventTarget {
  downlink: number;
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  rtt: number;
  saveData: boolean;
  onchange: EventListener;
}

// Define a type for Navigator with connection property
type NavigatorWithConnection = Navigator & { connection: NetworkInformation };

export type NetworkState = 'online' | 'offline' | 'slow' | 'fast';

interface NetworkContextType {
  networkState: NetworkState;
  isOnline: boolean;
  performance: 'good' | 'poor';
  lastOnline: Date | null;
}

const NetworkContext = createContext<NetworkContextType>({
  networkState: 'online',
  isOnline: true,
  performance: 'good',
  lastOnline: null,
});

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [networkState, setNetworkState] = useState<NetworkState>('online');
  const [lastOnline, setLastOnline] = useState<Date | null>(new Date());
  const [performance, setPerformance] = useState<'good' | 'poor'>('good');
  
  useEffect(() => {
    // Set initial state
    if (typeof navigator !== 'undefined') {
      setNetworkState(navigator.onLine ? 'online' : 'offline');
    }
    
    // Network status change handlers
    const handleOnline = () => {
      setNetworkState('online');
      setLastOnline(new Date());
    };
    
    const handleOffline = () => {
      setNetworkState('offline');
    };
    
    // Only attach event listeners on client side
    if (typeof window !== 'undefined') {
      // Register event listeners
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Performance monitoring
      if ('connection' in navigator && (navigator as NavigatorWithConnection).connection) {
        const connection = (navigator as NavigatorWithConnection).connection;
        
        const updateConnectionQuality = () => {
          if (!navigator.onLine) {
            setNetworkState('offline');
            setPerformance('poor');
            return;
          }
          
          // Check connection type
          const effectiveType = connection.effectiveType;
          const isSlow = ['slow-2g', '2g', '3g'].includes(effectiveType);
          
          if (isSlow) {
            setNetworkState('slow');
            setPerformance('poor');
          } else {
            setNetworkState('fast');
            setPerformance('good');
          }
        };
        
        updateConnectionQuality();
        connection.addEventListener('change', updateConnectionQuality);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          connection.removeEventListener('change', updateConnectionQuality);
        };
      }
      
      // Cleanup
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);
  
  const contextValue = {
    networkState,
    isOnline: networkState !== 'offline',
    performance,
    lastOnline,
  };
  
  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkState() {
  return useContext(NetworkContext);
}
