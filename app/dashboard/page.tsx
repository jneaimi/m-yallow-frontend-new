import { DashboardClient } from './dashboard-client';

// Simplified server component that just renders the client component
export default function DashboardPage() {
  // Server component doesn't need to do auth checks anymore
  // The AuthWrapper in the client component will handle authentication
  return <DashboardClient />;
}
