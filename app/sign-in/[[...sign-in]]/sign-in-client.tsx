'use client';

import { SignIn } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function SignInClient() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while auth state is determined
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center py-12">
        <LoadingSpinner text="Loading authentication..." />
      </div>
    );
  }

  // If already signed in, show a message
  if (isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center py-12 flex-col">
        <div className="mb-4 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">You're already signed in!</h2>
        <p className="text-gray-600 mb-4">You can now access the dashboard and other protected features.</p>
        <a href="/dashboard" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
          Go to Dashboard
        </a>
      </div>
    );
  }

  // Show sign-in component if not signed in
  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-lg'
          }
        }}
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />
    </div>
  );
}
