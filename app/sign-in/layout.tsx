import { LiveRegion } from "@/components/a11y/live-region";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip link target */}
      <div id="auth-content" tabIndex={-1} className="outline-none">
        {/* Authentication-specific live region for announcements */}
        <LiveRegion id="auth-form-announcer" politeness="assertive" />
        {children}
      </div>
    </>
  );
}
