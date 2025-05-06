'use client';

import React, { ReactNode } from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { AuthWrapper } from '@/components/auth/auth-wrapper';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthWrapper loadingText="Loading your dashboard...">
      <DashboardProvider>
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
          {/* Sidebar - hidden on mobile, visible on md+ screens */}
          <div className="hidden md:block md:w-64 md:flex-shrink-0">
            <DashboardSidebar />
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
            {/* Header - shown on all screens */}
            <DashboardHeader />
            
            {/* Main scrollable content */}
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
            
            {/* Footer (optional) */}
            <footer className="p-4 border-t text-center text-sm text-muted-foreground">
              <p>© 2025 M-Yallow. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </DashboardProvider>
    </AuthWrapper>
  );
}
