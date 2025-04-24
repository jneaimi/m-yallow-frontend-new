"use client";

import AuthErrorComponent from "@/components/auth/error-component";

export default function ProfileError({
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
      title="Profile Error"
      contextMessage="An error occurred while loading your profile."
      announcerId="profile-form-announcer"
      containerClassName="py-responsive px-responsive"
    />
  );
}
