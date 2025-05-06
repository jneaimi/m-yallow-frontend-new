'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useDashboard } from '../context/DashboardContext';
import { useUser } from '@/lib/context/user-context';
import { useProvider } from '@/lib/context/provider-context';
import { cn } from '@/lib/utils';
import { 
  Home, User, Bookmark, Star, Settings, 
  HelpCircle, LogOut, Users, ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, active, onClick }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md group",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  );
}

interface DashboardSidebarProps {
  isMobile?: boolean;
}

export function DashboardSidebar({ isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen } = useDashboard();
  const { user } = useUser();
  const { isProvider } = useProvider();
  
  // Get initials from user data for avatar fallback
  const initials = `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`;
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User';
  
  // If sidebar is collapsed on desktop and not mobile, show only icons
  const collapsed = !isMobile && !isSidebarOpen;
  
  // Define navigation items
  const navItems = [
    { href: '/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/dashboard/bookmarks', icon: <Bookmark className="h-5 w-5" />, label: 'Saved Providers' },
    { href: '/dashboard/reviews', icon: <Star className="h-5 w-5" />, label: 'My Reviews' },
    ...(isProvider 
      ? [{ href: '/dashboard/provider', icon: <Users className="h-5 w-5" />, label: 'Provider Dashboard' }] 
      : [{ href: '/dashboard/become-provider', icon: <Users className="h-5 w-5" />, label: 'Become a Provider' }]
    ),
    { href: '/dashboard/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];
  
  return (
    <div className={cn(
      "h-full flex flex-col bg-card border-r overflow-hidden transition-all duration-300",
      collapsed && !isMobile ? "w-16" : "w-64"
    )}>
      {/* Profile section */}
      <div className="p-4">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && !isMobile && "flex-col"
        )}>
          <Avatar className={cn("h-10 w-10", collapsed && !isMobile && "h-12 w-12")}>
            <AvatarImage src={user?.avatar_url || ''} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{fullName}</h3>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </nav>
      
      {/* Bottom actions */}
      <div className="p-4 space-y-3 border-t">
        {(!collapsed || isMobile) && (
          <>
            <NavItem 
              href="/help"
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
            />
            
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
              <Link href="/sign-out">
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Link>
            </Button>
          </>
        )}
        
        <div className={cn(
          "flex items-center justify-between",
          collapsed && !isMobile && "justify-center"
        )}>
          <ThemeToggle />
          {(!collapsed || isMobile) && <span className="text-xs text-muted-foreground">v1.0.0</span>}
        </div>
      </div>
    </div>
  );
}
