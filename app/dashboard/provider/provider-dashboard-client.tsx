'use client';

import { useProvider } from '@/lib/context/provider-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AuthWrapper } from '@/components/auth/auth-wrapper';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, MessageSquare, Users, Edit, 
  BookOpen, Settings, ArrowRight, Clock, ChevronRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

export function ProviderDashboardClient() {
  const { isProvider, isApproved, providerData, isLoading } = useProvider();
  const router = useRouter();
  
  // Redirect if not a provider or not approved
  useEffect(() => {
    if (!isLoading && (!isProvider || !isApproved)) {
      router.push('/dashboard');
    }
  }, [isProvider, isApproved, isLoading, router]);

  // Simulated metrics data
  const metrics = {
    views: 128,
    viewsChange: 12,
    inquiries: 7,
    inquiriesNew: 3,
    bookmarks: 24,
    responseRate: 92,
    averageRating: 4.8,
    reviewCount: 16,
  };

  // Simulated recent inquiries
  const recentInquiries = [
    { id: '1', name: 'John Smith', message: 'I would like to learn more about your services.', date: new Date(Date.now() - 2 * 60 * 60 * 1000), isNew: true },
    { id: '2', name: 'Sarah Johnson', message: 'Do you offer sessions on weekends?', date: new Date(Date.now() - 8 * 60 * 60 * 1000), isNew: true },
    { id: '3', name: 'Michael Brown', message: 'What are your rates for a 60-minute session?', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), isNew: true },
    { id: '4', name: 'Emma Wilson', message: 'I need to reschedule my appointment for next week.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isNew: false },
  ];

  // Format date function
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 24) {
      return `${Math.floor(diffHrs)} hours ago`;
    } else {
      const diffDays = diffHrs / 24;
      return `${Math.floor(diffDays)} days ago`;
    }
  };

  return (
    <AuthWrapper loadingText="Loading your provider dashboard...">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              {/* Instead of using Breadcrumb component, create a simpler version directly */}
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-foreground">Provider Dashboard</span>
              </div>
              <h1 className="text-2xl font-bold mt-2">Provider Dashboard</h1>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/provider/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Provider Settings
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/provider/profile">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Provider Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Provider Profile</CardTitle>
              <CardDescription>Your profile information as seen by potential clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="aspect-square rounded-md bg-primary/10 flex items-center justify-center">
                    {providerData?.logo ? (
                      <img 
                        src={providerData.logo} 
                        alt={providerData.name || 'Provider Logo'} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-primary">
                        {providerData?.name?.charAt(0) || 'P'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="md:w-3/4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{providerData?.name || 'Your Provider Name'}</h3>
                      <Badge variant="outline" className="ml-2">
                        Active
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {providerData?.description || 'Your provider description will appear here. Make sure to add a detailed description that explains your services and expertise.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{providerData?.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Email</p>
                      <p className="font-medium">{providerData?.contact || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{providerData?.category || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {providerData?.updatedAt ? new Date(providerData.updatedAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/providers/preview">
                  View Public Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Profile Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{metrics.views}</span>
                  <Badge variant={metrics.viewsChange > 0 ? 'success' : 'destructive'} className="text-xs">
                    {metrics.viewsChange > 0 ? '+' : ''}{metrics.viewsChange}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{metrics.inquiries}</span>
                  {metrics.inquiriesNew > 0 && (
                    <Badge className="bg-primary text-xs">
                      {metrics.inquiriesNew} new
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" />
                  Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{metrics.responseRate}%</span>
                  </div>
                  <Progress value={metrics.responseRate} className="h-2" />
                  <p className="text-sm text-muted-foreground">Respond within 48 hours to maintain a high rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="inquiries" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inquiries">Recent Inquiries</TabsTrigger>
              <TabsTrigger value="reviews">Client Reviews</TabsTrigger>
              <TabsTrigger value="services">Your Services</TabsTrigger>
            </TabsList>
            
            {/* Inquiries Tab */}
            <TabsContent value="inquiries" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Client Inquiries</CardTitle>
                  <CardDescription>
                    Respond promptly to increase your response rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentInquiries.length > 0 ? (
                    <div className="space-y-4">
                      {recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="flex items-start gap-3 border-b pb-4 last:border-0">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium">
                              {inquiry.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{inquiry.name}</h4>
                              {inquiry.isNew && (
                                <Badge className="bg-primary text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {inquiry.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(inquiry.date)}
                              </span>
                              <Button size="sm" variant="outline">Respond</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No inquiries yet</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href="/dashboard/provider/inquiries">
                      View All Inquiries
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Reviews</CardTitle>
                  <CardDescription>
                    Reviews and ratings from your clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="md:w-1/4 flex flex-col items-center">
                      <div className="text-5xl font-bold text-primary">{metrics.averageRating}</div>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(metrics.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {metrics.reviewCount} reviews
                      </p>
                    </div>
                    
                    <div className="md:w-3/4">
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          // Simulate percentage of reviews for each star rating
                          const percent = rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 2 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-16">
                                <span className="text-sm">{rating}</span>
                                <svg
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-yellow-400"
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-12 text-right text-sm text-muted-foreground">
                                {percent}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href="/dashboard/provider/reviews">
                      View All Reviews
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Services Tab */}
            <TabsContent value="services" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Services</CardTitle>
                  <CardDescription>
                    Manage the services you offer to clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Placeholder for services */}
                    {providerData?.services?.length > 0 ? (
                      providerData.services.map((service: any, index: number) => (
                        <div key={index} className="border rounded-md p-4">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-medium">${service.price}</span>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          You haven't added any services yet. Add services to let potential clients know what you offer.
                        </p>
                        <Button asChild>
                          <Link href="/dashboard/provider/services/add">
                            Add Your First Service
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href="/dashboard/provider/services">
                      Manage All Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
