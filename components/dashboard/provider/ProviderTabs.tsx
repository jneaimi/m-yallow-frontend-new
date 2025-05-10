'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderInquiriesTab } from "./ProviderInquiriesTab";
import { ProviderReviewsTab } from "./ProviderReviewsTab";
import { ProviderServicesTab } from "./ProviderServicesTab";

export function ProviderTabs() {
  return (
    <Tabs defaultValue="inquiries" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inquiries">Recent Inquiries</TabsTrigger>
        <TabsTrigger value="reviews">Client Reviews</TabsTrigger>
        <TabsTrigger value="services">Your Services</TabsTrigger>
      </TabsList>
      
      <TabsContent value="inquiries" className="pt-4">
        <ProviderInquiriesTab />
      </TabsContent>
      
      <TabsContent value="reviews" className="pt-4">
        <ProviderReviewsTab />
      </TabsContent>
      
      <TabsContent value="services" className="pt-4">
        <ProviderServicesTab />
      </TabsContent>
    </Tabs>
  );
}
