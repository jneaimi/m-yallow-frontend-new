'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useProviderServices, Service } from "@/hooks/providers/use-provider-services";
import { useProviderMe } from "@/hooks/providers/use-provider-me";

export function ProviderServicesTab() {
  const { data: providerData } = useProviderMe();
  const { data: services, isLoading } = useProviderServices();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Services</CardTitle>
          <CardDescription>
            Manage the services you offer to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse border rounded-md p-4">
                <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Services</CardTitle>
        <CardDescription>
          Manage the services you offer to clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Use real services data if available */}
          {services && services.length > 0 ? (
            services.map((service: Service) => (
              <div key={service.id} className="border rounded-md p-4">
                <h4 className="font-medium">{service.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-medium">${service.price}</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/provider/services/${service.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            // Fall back to provider services if available
            providerData?.services && Array.isArray(providerData.services) && providerData.services.length > 0 ? (
              providerData.services.map((service: {name: string; description: string; price: number}, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-medium">${service.price}</span>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/provider/services/${index}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              // Empty state
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
            )
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
  );
}
