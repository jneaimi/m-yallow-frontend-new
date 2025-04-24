"use client";

import AuthErrorComponent from "@/components/auth/error-component";

export default function SignInError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AuthErrorComponent
      error={error}
      reset={reset}
      title="Authentication Error"
      contextMessage="An error occurred during sign in."
      announcerId="auth-form-announcer"
      containerClassName="flex items-center justify-center min-h-[calc(100vh-12rem)] py-responsive px-responsive"
    />
  );
}
