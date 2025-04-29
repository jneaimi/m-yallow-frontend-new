"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface ContactFormProps {
  providerName: string;
  providerId: number;
  providerEmail?: string;
}

export function ProviderContactForm({ providerName, providerId, providerEmail }: ContactFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    // Only include recipientEmail if providerEmail is provided
    ...(providerEmail ? { recipientEmail: providerEmail } : {})
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    message: string;
    type: 'success' | 'error' | null;
  }>({
    message: '',
    type: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: '', type: null });

    try {
      // Send the form data to the API
      const response = await fetch(`/api/providers/${providerId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      // Show success message
      setFormStatus({
        message: `Your message to ${providerName} has been sent successfully.`,
        type: 'success'
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        ...(providerEmail ? { recipientEmail: providerEmail } : {})
      });
      
      // Close dialog after a delay
      setTimeout(() => {
        setIsOpen(false);
        setFormStatus({ message: '', type: null });
      }, 2000);
    } catch (error) {
      setFormStatus({
        message: error instanceof Error ? error.message : "There was a problem sending your message. Please try again.",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Contact Provider</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {providerName}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {formStatus.type && (
            <div className={`p-3 rounded-md ${
              formStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formStatus.message}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              className="min-h-[120px]"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting || formStatus.type === 'success'}>
              {isSubmitting ? "Sending..." : formStatus.type === 'success' ? "Sent!" : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
