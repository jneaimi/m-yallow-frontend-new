import { LiveRegion } from "@/components/a11y/live-region";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip link target */}
      <main id="auth-content" tabIndex={-1}>
        {/* Authentication-specific live region for announcements */}
        <LiveRegion id="auth-form-announcer" politeness="assertive" />
        {children}
      </main>
    </>
  );
}
