'use client';

// Model
import { useSettingsModel } from './model/settings-model';

// Controller 
import { SettingsAuthController } from './auth/settings-auth-controller';

// UI Components (Presenters)
import { SettingsLoading } from './ui/settings-loading';
import { SettingsLayout } from './ui/settings-layout';
import { ProfileInfoCard, AccountManagementCard, DeveloperSettingsCard } from './ui/settings-cards';

/**
 * Settings page client component
 * Implements MCP (Model-Controller-Presenter) pattern for clearer separation of concerns
 */
export function SettingsPageClient() {
  // Get data from model
  const { user, isUserLoading, isSignedIn, isAuthLoaded, isDevelopment } = useSettingsModel();
  
  // Perform early authentication check - redirect and return null if not authenticated
  // This prevents the UI flash before redirect
  if (isAuthLoaded && !isSignedIn) {
    SettingsAuthController.checkAuthentication(isAuthLoaded, isSignedIn);
    return null; // Stop rendering immediately
  }
  
  // Handle loading state
  if (!isAuthLoaded || isUserLoading) {
    return <SettingsLoading />;
  }
  
  // Render settings UI with modular components
  return (
    <SettingsLayout>
      <ProfileInfoCard />
      <AccountManagementCard />
      {isDevelopment && <DeveloperSettingsCard user={user} />}
    </SettingsLayout>
  );
}
