'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { useUser } from '@/lib/context/user-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const settingsSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters.',
  }).max(50, {
    message: 'Display name must not exceed 50 characters.',
  }).optional(),
  first_name: z.string().min(1, {
    message: 'First name is required.',
  }).max(50).optional(),
  last_name: z.string().min(1, {
    message: 'Last name is required.',
  }).max(50).optional(),
  emailNotifications: z.boolean().default(true),
  appNotifications: z.boolean().default(true),
  showReviews: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function UserSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading, updateUser } = useUser();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      emailNotifications: user?.preferences?.notifications?.email ?? true,
      appNotifications: user?.preferences?.notifications?.app ?? true,
      showReviews: user?.preferences?.privacy?.showReviews ?? true,
    },
  });
  
  // Update form when user data changes - more efficiently
  useEffect(() => {
    if (user && !form.formState.isDirty) {
      form.reset({
        displayName: user.displayName || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        emailNotifications: user.preferences?.notifications?.email ?? true,
        appNotifications: user.preferences?.notifications?.app ?? true,
        showReviews: user.preferences?.privacy?.showReviews ?? true,
      });
    }
  }, [user, form]);

  async function onSubmit(data: SettingsFormValues) {
    setIsSubmitting(true);
    try {
      await updateUser({
        first_name: data.first_name,
        last_name: data.last_name,
        displayName: data.displayName,
        preferences: {
          notifications: {
            email: data.emailNotifications,
            app: data.appNotifications,
          },
          privacy: {
            showReviews: data.showReviews,
          },
        },
      });
      
      toast.success('Your preferences have been saved successfully.');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update your settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner text="Loading your settings..." />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your display name" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your reviews and public interactions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormDescription>
                    Receive email notifications about your account and interactions.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>In-App Notifications</FormLabel>
                  <FormDescription>
                    Receive notifications within the app.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy Settings</h3>
          
          <FormField
            control={form.control}
            name="showReviews"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Show My Reviews</FormLabel>
                  <FormDescription>
                    Allow other users to see reviews you've submitted.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
