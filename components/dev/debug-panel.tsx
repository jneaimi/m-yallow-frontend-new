'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/lib/context/user-context';
import { userContextConfig, UserDataSource } from '@/lib/context/user-context-config';
import { apiMetrics } from '@/lib/api-metrics';
import { X, Maximize2, Minimize2, Activity, User, Settings, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNetworkState } from '@/lib/network-context';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, refreshUser, setDataSource, currentDataSource } = useUser();
  const { networkState, isOnline } = useNetworkState();
  const [showRawData, setShowRawData] = useState(false);
  
  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-background shadow-md"
      >
        Debug
      </Button>
    );
  }
  
  const toggleAutoRefresh = () => {
    const currentConfig = userContextConfig.get();
    const newInterval = currentConfig.autoRefreshInterval ? null : 30000; // 30 seconds
    
    userContextConfig.update({
      autoRefreshInterval: newInterval
    });
    
    // Force re-render
    refreshUser();
  };
  
  const toggleSyncOnUpdate = () => {
    const currentConfig = userContextConfig.get();
    
    userContextConfig.update({
      syncOnUpdate: !currentConfig.syncOnUpdate
    });
  };
  
  const changeDataSource = (source: UserDataSource) => {
    setDataSource(source);
  };
  
  const clearMetrics = () => {
    apiMetrics.clearMetrics();
    // Force re-render
    setShowRawData(!showRawData);
  };
  
  // Get metrics data
  const metrics = apiMetrics.getMetrics();
  const userEndpointMetrics = apiMetrics.getMetricsForEndpoint('/users/me');
  const avgDuration = apiMetrics.getAverageDuration();
  const errorRate = apiMetrics.getErrorRate();
  
  return (
    <Card 
      className={`fixed ${isExpanded ? 'top-4 left-4 right-4 bottom-4' : 'bottom-4 right-4 w-96'} z-50 shadow-xl overflow-hidden`}
    >
      <CardHeader className="p-3 bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Developer Debug Panel</CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="h-8 w-8"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Debug tools for development only
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="user-data">
        <div className="px-4 pt-2 border-b">
          <TabsList>
            <TabsTrigger value="user-data" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>User Data</span>
            </TabsTrigger>
            <TabsTrigger value="api-metrics" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>API Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className={`${isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-64'} overflow-auto p-3`}>
          <TabsContent value="user-data" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Current User Data Source</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    {currentDataSource}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Network Status</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isOnline 
                      ? "bg-green-500/20 text-green-700 dark:text-green-400" 
                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}>
                    {networkState}
                  </span>
                </div>
                
                <div className="flex justify-between gap-4 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => changeDataSource('backend')}
                    variant={currentDataSource === 'backend' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Use Backend
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => changeDataSource('clerk')}
                    variant={currentDataSource === 'clerk' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Use Clerk
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">User Object</h3>
                  <Button variant="ghost" size="sm" onClick={() => refreshUser()}>
                    Refresh
                  </Button>
                </div>
                
                <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-60">
                  {user ? JSON.stringify(user, null, 2) : 'No user data'}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api-metrics" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border p-3 text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Avg Response Time</h4>
                  <div className="text-xl font-semibold">
                    {avgDuration.toFixed(2)}ms
                  </div>
                </div>
                <div className="rounded-md border p-3 text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Error Rate</h4>
                  <div className="text-xl font-semibold">
                    {(errorRate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">
                    Recent Requests ({metrics.length})
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearMetrics}>
                    Clear
                  </Button>
                </div>
                
                <div className="space-y-2 overflow-auto max-h-40">
                  {metrics.map((metric, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-2 rounded border ${
                        metric.status && metric.status >= 400 
                          ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' 
                          : 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {metric.method} {metric.endpoint}
                        </span>
                        <span>
                          {metric.status || '—'} 
                          {metric.duration && ` (${metric.duration.toFixed(0)}ms)`}
                        </span>
                      </div>
                      {metric.error && (
                        <div className="text-red-500 mt-1">{metric.error}</div>
                      )}
                    </div>
                  ))}
                  {metrics.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center p-4">
                      No API requests recorded yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-refresh" 
                  checked={!!userContextConfig.get().autoRefreshInterval}
                  onCheckedChange={toggleAutoRefresh}
                />
                <div>
                  <Label htmlFor="auto-refresh" className="text-sm font-medium">
                    Auto-refresh user data
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Refresh user data every 30 seconds
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="sync-updates" 
                  checked={userContextConfig.get().syncOnUpdate}
                  onCheckedChange={toggleSyncOnUpdate}
                />
                <div>
                  <Label htmlFor="sync-updates" className="text-sm font-medium">
                    Sync on update
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Keep Clerk and backend data in sync when updates occur
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Current Configuration</h3>
                <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-40">
                  {JSON.stringify(userContextConfig.get(), null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-end p-3 border-t">
        <div className="text-xs text-muted-foreground">
          Development build - {new Date().toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
