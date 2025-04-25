import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName || 'User'}!</h2>
        <p className="text-muted-foreground mb-4">
          This is a protected dashboard page that requires authentication.
          You're seeing this because you're successfully signed in.
        </p>
        
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Your Account Information</h3>
          <ul className="space-y-2">
            <li><span className="font-medium">Email:</span> {user?.emailAddresses[0]?.emailAddress}</li>
            <li><span className="font-medium">User ID:</span> {user?.id}</li>
            <li><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
