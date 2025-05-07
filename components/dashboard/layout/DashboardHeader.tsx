'use client';

import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useUser } from '@/lib/context/user-context';
import { Button } from '@/components/ui/button';
import { Bell, Menu, Search, Settings, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardSidebar } from './DashboardSidebar';
import { Input } from '@/components/ui/input';

export function DashboardHeader() {
  const { getGreeting, toggleSidebar } = useDashboard();
  const { user } = useUser();
  
  // Get initials from user data for avatar fallback
  const initials = `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`;
  const greeting = getGreeting();
  
  return (
    <header className="border-b bg-card/50 p-4">
      <div className="flex items-center justify-between">
        {/* Left section with menu toggle and greeting */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu trigger - hidden on md+ screens */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <DashboardSidebar isMobile />
            </SheetContent>
          </Sheet>
          
          {/* Desktop sidebar toggle */}
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          {/* Welcome message - hidden on small screens */}
          <div className="hidden sm:block">
            <h2 className="text-lg font-medium">
              {greeting}, {user?.first_name || 'User'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Welcome to your dashboard
            </p>
          </div>
        </div>
        
        {/* Center section - search (visible on larger screens) */}
        <div className="hidden lg:block max-w-md w-full mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 bg-background"
            />
          </div>
        </div>
        
        {/* Right section - actions and profile */}
        <div className="flex items-center space-x-2">
          {/* Action buttons */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </a>
          </Button>
          
          {/* User avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || ''} alt={user?.first_name || 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
