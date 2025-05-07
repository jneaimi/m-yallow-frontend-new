'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useDashboard } from '@/components/dashboard/context/DashboardContext';
import { toast } from 'sonner';
import { Save, RefreshCw, LayoutDashboard, ChevronRight } from 'lucide-react';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import Link from 'next/link';

export default function DashboardPreferencesPage() {
  const { preferences, updatePreferences } = useDashboard();
  const [visibleWidgets, setVisibleWidgets] = React.useState<string[]>(
    preferences.visibleWidgets || []
  );
  
  // Dummy function to simulate saving preferences to the backend
  const savePreferences = async () => {
    // Update context with new preferences
    updatePreferences({
      visibleWidgets: visibleWidgets,
    });
    
    // Show success message
    toast.success('Dashboard preferences saved successfully');
  };
  
  // Reset preferences to default
  const resetToDefault = () => {
    const defaultWidgets = ['activity', 'bookmarks', 'reviews', 'provider', 'account'];
    setVisibleWidgets(defaultWidgets);
    toast.info('Preferences reset to default');
  };
  
  // Toggle widget visibility
  const toggleWidget = (widgetId: string) => {
    setVisibleWidgets(prev => {
      if (prev.includes(widgetId)) {
        return prev.filter(id => id !== widgetId);
      } else {
        return [...prev, widgetId];
      }
    });
  };
  
  return (
    <AuthWrapper loadingText="Loading preferences...">
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            {/* Simple breadcrumb navigation */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href="/dashboard/settings" className="hover:text-foreground">
                Settings
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-medium text-foreground">Preferences</span>
            </div>
          
            <div className="flex items-center justify-between mt-2">
              <h1 className="text-2xl font-bold">Dashboard Preferences</h1>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetToDefault}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
                <Button size="sm" onClick={savePreferences}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Customize Dashboard Widgets
              </CardTitle>
              <CardDescription>
                Select which widgets to display on your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="widget-activity">Activity Widget</Label>
                    <p className="text-sm text-muted-foreground">
                      Shows your recent activity and login history
                    </p>
                  </div>
                  <Switch 
                    id="widget-activity" 
                    checked={visibleWidgets.includes('activity')}
                    onCheckedChange={() => toggleWidget('activity')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="widget-account">Account Information</Label>
                    <p className="text-sm text-muted-foreground">
                      Displays your account details and personal information
                    </p>
                  </div>
                  <Switch 
                    id="widget-account" 
                    checked={visibleWidgets.includes('account')}
                    onCheckedChange={() => toggleWidget('account')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="widget-bookmarks">Saved Providers</Label>
                    <p className="text-sm text-muted-foreground">
                      Shows your bookmarked providers
                    </p>
                  </div>
                  <Switch 
                    id="widget-bookmarks" 
                    checked={visibleWidgets.includes('bookmarks')}
                    onCheckedChange={() => toggleWidget('bookmarks')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="widget-reviews">My Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Displays your recent reviews
                    </p>
                  </div>
                  <Switch 
                    id="widget-reviews" 
                    checked={visibleWidgets.includes('reviews')}
                    onCheckedChange={() => toggleWidget('reviews')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="widget-provider">Provider Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Shows your provider status or application information
                    </p>
                  </div>
                  <Switch 
                    id="widget-provider" 
                    checked={visibleWidgets.includes('provider')}
                    onCheckedChange={() => toggleWidget('provider')}
                  />
                </div>
              </div>
              
              {/* Future enhancement: Widget reordering with drag-and-drop */}
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm">
                  Coming soon: Drag and drop widgets to customize your dashboard layout.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={savePreferences}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
