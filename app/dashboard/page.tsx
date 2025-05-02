import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSummary } from '@/components/user/profile-summary';
import { BecomeProviderBanner } from '@/components/user/become-provider-banner';

// This is a server component to fetch initial data
export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileSummary />
          <BecomeProviderBanner />
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.firstName || 'User'}!</CardTitle>
              <CardDescription>
                Manage your saved providers, reviews, and account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="saves">Saved Providers</TabsTrigger>
                  <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-4">
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <h3 className="font-medium mb-2">Your Account Information</h3>
                    <ul className="space-y-2">
                      <li><span className="font-medium">Email:</span> {user.emailAddresses?.[0]?.emailAddress || 'Not available'}</li>
                      <li><span className="font-medium">User ID:</span> {user.id || 'Not available'}</li>
                      <li><span className="font-medium">Name:</span> {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Not available'}</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground">
                    Use the tabs above to navigate through your dashboard. You can view your saved providers, manage your reviews, and update your account settings.
                  </p>
                </TabsContent>
                <TabsContent value="saves" className="pt-4">
                  <p className="text-muted-foreground mb-4">
                    View and manage the providers you've saved.
                  </p>
                  <a href="/dashboard/bookmarks" className="text-primary hover:underline">
                    View all saved providers
                  </a>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <p className="text-muted-foreground mb-4">
                    View and manage the reviews you've left for providers.
                  </p>
                  <a href="/dashboard/reviews" className="text-primary hover:underline">
                    View all my reviews
                  </a>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
