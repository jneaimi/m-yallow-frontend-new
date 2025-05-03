'use client';

import { useUser } from '@/lib/context/user-context';
import { useAuth } from '@clerk/nextjs';
import { ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthWrapperProps {
  children: ReactNode;
  loadingText?: string;
  requireBackendProfile?: boolean;
}

/**
 * A simplified authentication wrapper component that:
 * 1. Checks for Clerk authentication
 * 2. Optionally checks for backend user profile
 * 3. Shows appropriate UI for each state
 */
export function AuthWrapper({
  children,
  loadingText = 'Loading...',
  requireBackendProfile = true
}: AuthWrapperProps) {
  const { user, isLoading: isUserLoading } = useUser();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  // Determine if we should show loading state
  const showLoading = !isAuthLoaded || (requireBackendProfile && isUserLoading);

  // If still loading, show loading state
  if (showLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  // If not signed in, show a message
  if (!isSignedIn) {
    return (
      <div className="container py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="font-medium text-lg mb-2">Authentication Required</h3>
          <p className="mb-4">
            You need to be signed in to access this page.
          </p>
          <a href="/sign-in" className="px-4 py-2 bg-amber-200 text-amber-800 rounded hover:bg-amber-300 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // If backend profile is required but not available
  if (requireBackendProfile && !user && isSignedIn) {
    return (
      <div className="container py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
          <h3 className="font-medium text-lg mb-2">Profile Unavailable</h3>
          <p>
            Your profile information couldn't be loaded from our system.
            This might be a temporary issue. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // If all checks pass, render children
  return <>{children}</>;
}
