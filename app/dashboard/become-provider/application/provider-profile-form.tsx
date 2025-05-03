'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  location: z.string().min(5, {
    message: 'Location must be at least 5 characters.',
  }).max(200, {
    message: 'Location must not exceed 200 characters.',
  }),
  about: z.string().min(10, {
    message: 'About section must be at least 10 characters.',
  }).max(1000, {
    message: 'About section must not exceed 1000 characters.',
  }),
});

type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;

export function ProviderProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { createProvider } = useProviderClient();
  
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: '',
      contact: '',
      location: '',
      about: '',
    },
  });
  
  async function onSubmit(data: ProviderProfileFormValues) {
    setIsSubmitting(true);
    try {
      const response = await createProvider(data);
      
      // Store the provider ID for subsequent steps
      sessionStorage.setItem('createdProviderId', response.id.toString());
      
      // Show success message with promise to handle navigation
      toast.promise(
        // Artificial delay to show the toast before navigation
        new Promise(resolve => setTimeout(resolve, 1000)), 
        {
          loading: 'Creating your provider profile...',
          success: () => {
            // Navigate to the next step after the toast is shown
            setTimeout(() => {
              router.push(`/dashboard/become-provider/application/images?providerId=${response.id}`);
            }, 500);
            return 'Provider profile created successfully!';
          },
          error: 'Failed to create provider profile',
        }
      );
    } catch (error: any) {
      console.error('Failed to create provider profile:', error);
      
      // Provide more specific error messages based on the error
      if (error.response?.status === 401) {
        toast.error('Authentication error. Please sign in again.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid provider information. Please check your inputs.');
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Failed to create provider profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, State, or Address" {...field} />
              </FormControl>
              <FormDescription>
                Where your services are offered or business is located.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
  );
}