'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, MapPin } from 'lucide-react';
import axios, { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProviderClient } from '@/lib/api/providers/client';
import { LocationSelector, LocationFormData } from '@/components/providers/LocationSelector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Form validation schema
const providerProfileSchema = z.object({
  name: z.string().min(2, {
    message: 'Business name must be at least 2 characters.',
  }).max(100, {
    message: 'Business name must not exceed 100 characters.',
  }),
  contact: z.string().min(5, {
    message: 'Contact information must be at least 5 characters.',
  }).max(200, {
    message: 'Contact information must not exceed 200 characters.',
  }),
  about: z.string().min(10, {
    message: 'About section must be at least 10 characters.',
  }).max(1000, {
    message: 'About section must not exceed 1000 characters.',
  }),
  // Location fields are handled separately through the LocationSelector component
});

type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;

export function ProviderProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationData, setLocationData] = useState<LocationFormData | null>(null);
  const router = useRouter();
  const { createProvider } = useProviderClient();
  
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: '',
      contact: '',
      about: '',
    },
  });
  
  // Handle location selection from the LocationSelector component
  const handleLocationSelected = (data: LocationFormData) => {
    setLocationData(data);
  };
  
  async function onSubmit(data: ProviderProfileFormValues) {
    // Validate that we have location data
    if (!locationData) {
      toast.error('Please select a location using the map or manual entry');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Combine form data with location data
      const providerData = {
        ...data,
        location: locationData.location,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        street: locationData.street,
        city: locationData.city,
        state: locationData.state,
        postal_code: locationData.postal_code,
        country: locationData.country,
      };
      
      // Use toast.promise with the actual API call promise
      toast.promise(
        createProvider(providerData).then(response => {
          // Store the provider ID for subsequent steps
          sessionStorage.setItem('createdProviderId', response.id.toString());
          // Navigate to the next step
          router.push(`/dashboard/become-provider/application/images?providerId=${response.id}`);
          return response;
        }),
        {
          loading: 'Creating your provider profile...',
          success: 'Provider profile created successfully!',
          error: 'Failed to create provider profile',
        }
      );
    } catch (err: unknown) {
      console.error('Failed to create provider profile:', err);
      
      // Provide more specific error messages based on the error
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        
        if (error.response?.status === 401) {
          toast.error('Authentication error. Please sign in again.');
        } else if (error.response?.status === 400) {
          toast.error('Invalid provider information. Please check your inputs.');
        } else if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          toast.error(`Error: ${(error.response.data as { message: string }).message}`);
        } else {
          toast.error(`Server error: ${error.message || 'Unknown error'}`);
        }
      } else {
        toast.error('Failed to create provider profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business or Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your business name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to users searching for services.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number, email, or website" {...field} />
                </FormControl>
                <FormDescription>
                  How customers can reach you. This will be visible to users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Location Selector Component */}
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <h3 className="text-lg font-medium">Location Information</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose your location on the map or enter your address details
            </p>
            
            <LocationSelector 
              onLocationSelected={handleLocationSelected}
              defaultValues={locationData || undefined}
            />
            
            {locationData && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
                <p className="text-green-700 dark:text-green-300 font-medium">Location selected successfully</p>
                <p className="text-sm text-muted-foreground">{locationData.location}</p>
                
                <Accordion type="single" collapsible className="mt-2">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm py-2">View address details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {locationData.street && (
                          <div>
                            <span className="font-medium">Street:</span> {locationData.street}
                          </div>
                        )}
                        {locationData.city && (
                          <div>
                            <span className="font-medium">City:</span> {locationData.city}
                          </div>
                        )}
                        {locationData.state && (
                          <div>
                            <span className="font-medium">State:</span> {locationData.state}
                          </div>
                        )}
                        {locationData.postal_code && (
                          <div>
                            <span className="font-medium">Postal Code:</span> {locationData.postal_code}
                          </div>
                        )}
                        {locationData.country && (
                          <div>
                            <span className="font-medium">Country:</span> {locationData.country}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Coordinates:</span> {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Your Services</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your services, experience, and what makes you unique..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide details about what you offer, your experience, and why users should choose you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : "Create Provider Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}