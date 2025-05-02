'use client';

import { useState } from 'react';
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
import { useUserProfile } from '@/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const settingsSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters.',
  }).max(50, {
    message: 'Display name must not exceed 50 characters.',
  }).optional(),
  emailNotifications: z.boolean().default(true),
  appNotifications: z.boolean().default(true),
  showReviews: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function UserSettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile, updateProfile, isLoading } = useUserProfile();
  const { user } = useUser();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: profile?.displayName || user?.fullName || '',
      emailNotifications: profile?.preferences?.notifications?.email ?? true,
      appNotifications: profile?.preferences?.notifications?.app ?? true,
      showReviews: profile?.preferences?.privacy?.showReviews ?? true,
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsSubmitting(true);
    try {
      await updateProfile({
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your settings...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
