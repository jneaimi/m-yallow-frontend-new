'use client';

import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ActivityWidget } from './ActivityWidget';
import { BookmarksWidget } from './BookmarksWidget';
import { ReviewsWidget } from './ReviewsWidget';
import { ProviderStatusWidget } from './ProviderStatusWidget';
import { AccountInfoWidget } from './AccountInfoWidget';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function DashboardGrid() {
  const { preferences, updatePreferences } = useDashboard();
  
  // Get visible widgets based on preferences
  const visibleWidgets = preferences.visibleWidgets || [
    'activity', 'bookmarks', 'reviews', 'provider', 'account'
  ];
  
  // Helper to render widgets based on type
  const renderWidget = (type: string) => {
    switch (type) {
      case 'activity':
        return <ActivityWidget />;
      case 'bookmarks':
        return <BookmarksWidget />;
      case 'reviews':
        return <ReviewsWidget />;
      case 'provider':
        return <ProviderStatusWidget />;
      case 'account':
        return <AccountInfoWidget />;
      default:
        return null;
    }
  };
  
  // Future enhancement: Add drag-and-drop for widget rearrangement
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button variant="outline" size="sm" asChild>
          <a href="/dashboard/settings/preferences">
            <Settings className="mr-2 h-4 w-4" />
            Customize Dashboard
          </a>
        </Button>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* First, render the activity widget which spans 2 columns on medium screens */}
        {visibleWidgets.includes('activity') && (
          <div className="md:col-span-2 lg:col-span-2">
            {renderWidget('activity')}
          </div>
        )}
        
        {/* Render account widget */}
        {visibleWidgets.includes('account') && (
          <div className="lg:col-span-1">
            {renderWidget('account')}
          </div>
        )}
        
        {/* Render provider status widget */}
        {visibleWidgets.includes('provider') && (
          <div className="md:col-span-1 lg:col-span-1">
            {renderWidget('provider')}
          </div>
        )}
        
        {/* Render bookmarks widget */}
        {visibleWidgets.includes('bookmarks') && (
          <div className="md:col-span-1 lg:col-span-1">
            {renderWidget('bookmarks')}
          </div>
        )}
        
        {/* Render reviews widget */}
        {visibleWidgets.includes('reviews') && (
          <div className="md:col-span-1 lg:col-span-1">
            {renderWidget('reviews')}
          </div>
        )}
      </div>
    </div>
  );
}
