'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { DashboardGrid } from '@/components/dashboard/widgets/DashboardGrid';
import { AuthWrapper } from '@/components/auth/auth-wrapper';

export function DashboardClient() {
  return (
    <AuthWrapper loadingText="Loading your dashboard...">
      <DashboardLayout>
        <DashboardGrid />
      </DashboardLayout>
    </AuthWrapper>
  );
}
