'use client';

import { ChevronRight, Settings, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface ActionItem {
  label: string;
  href: string;
  icon?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ActionItem[];
  children?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: DashboardHeaderProps) {
  // Map icon names to components
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null;
    
    // You can add more icons as needed
    const icons: Record<string, ReactNode> = {
      Settings: <Settings className="mr-2 h-4 w-4" />,
      Edit: <Edit className="mr-2 h-4 w-4" />,
      Plus: <Plus className="mr-2 h-4 w-4" />,
    };
    
    return icons[iconName] || null;
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-foreground">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold mt-2">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
        {children}
      </div>
      
      {actions && actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button 
              key={index}
              variant={action.variant || 'default'} 
              size="sm" 
              asChild
            >
              <Link href={action.href}>
                {action.icon && getIconComponent(action.icon)}
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
