'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Common layout for settings pages
 */
export function SettingsLayout({ children, title = "Account Settings" }: SettingsLayoutProps) {
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      
      <div className="grid gap-6">
        {children}
      </div>
    </div>
  );
}
