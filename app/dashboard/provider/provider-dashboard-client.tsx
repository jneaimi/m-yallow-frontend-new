'use client';

import { useProviderMe } from '@/hooks/providers/use-provider-me';
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { ProviderProfileCard } from '@/components/dashboard/provider/ProviderProfileCard';
import { ProviderMetricsSection } from '@/components/dashboard/provider/ProviderMetricsSection';
import { ProviderTabs } from '@/components/dashboard/provider/ProviderTabs';
import { DashboardHeader } from '@/components/dashboard/provider/DashboardHeader';

export function ProviderDashboardClient() {
  const { data: providerData, isLoading } = useProviderMe();
  const router = useRouter();
  
  const isProvider = !!providerData;
  const isApproved = providerData?.approved || false;
  
  // Redirect if not a provider or not approved
  useEffect(() => {
    if (!isLoading && (!isProvider || !isApproved)) {
      router.push('/dashboard');
    }
  }, [isProvider, isApproved, isLoading, router]);

  return (
    <AuthWrapper loadingText="Loading your provider dashboard...">
      <DashboardLayout>
        <div className="space-y-6">
          <DashboardHeader
            title="Provider Dashboard"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Provider Dashboard', href: '/dashboard/provider' }
            ]}
            actions={[
              { 
                label: 'Provider Settings',
                icon: 'Settings', 
                href: '/dashboard/provider/settings',
                variant: 'outline'
              },
              { 
                label: 'Edit Profile',
                icon: 'Edit', 
                href: '/dashboard/provider/profile'
              }
            ]}
          />
          
          {/* Provider Profile Card */}
          <ProviderProfileCard />
          
          {/* Metrics Section */}
          <ProviderMetricsSection />
          
          {/* Tabs for different sections */}
          <ProviderTabs />
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
