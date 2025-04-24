import { LiveRegion } from "@/components/a11y/live-region";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip link target */}
      <div id="profile-content" tabIndex={-1} className="outline-none">
        {/* Profile-specific live region for announcements */}
        <LiveRegion id="profile-form-announcer" politeness="assertive" />
        {children}
      </div>
    </>
  );
}
