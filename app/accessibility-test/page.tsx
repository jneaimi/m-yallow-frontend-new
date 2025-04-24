"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  auditThemeContrast, 
  createContrastDiagnostic 
} from "@/lib/accessibility/color-contrast";
import { announce } from "@/lib/accessibility/screen-reader";

/**
 * Accessibility Test Page
 * 
 * This page provides a testing ground for all accessibility features
 * implemented in the project. It allows testing various components
 * for keyboard navigation, screen reader compatibility, and color contrast.
 */
export default function AccessibilityTestPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = {
      name: formValues.name ? "" : "Name is required",
      email: formValues.email 
        ? !formValues.email.includes('@') 
          ? "Please enter a valid email address" 
          : "" 
        : "Email is required",
    };
    
    setFormErrors(errors);
    
    // If no errors, submit form
    if (!errors.name && !errors.email) {
      toast.success("Form submitted successfully");
      announce("Form submitted successfully", "polite");
    } else {
      const errorMessage = "Please correct the errors in the form";
      toast.error(errorMessage);
      announce(errorMessage, "assertive");
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Run color contrast audit
  const runContrastAudit = () => {
    const report = auditThemeContrast();
    const diagnosticOutput = createContrastDiagnostic();
    
    // Log to console for debugging
    console.log("Color Contrast Audit:", report);
    
    // Show the report
    toast.info("Color contrast audit completed. See console for details.");
    
    // Create a more detailed report
    let message = "### Color Contrast Report\n\n";
    Object.entries(report).forEach(([name, data]) => {
      message += `**${name}**: ${data.ratio.toFixed(2)}:1 - `;
      message += data.passesAA ? "✅ Passes AA" : "❌ Fails AA";
      message += "\n";
    });
    
    // Show detailed report in alert
    alert(message);
  };

  return (
    <div className="container py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Accessibility Testing Page</h1>
        <p className="text-muted-foreground mb-4">
          Use this page to test and verify accessibility features.
        </p>
      </header>

      {/* Keyboard Navigation Testing */}
      <section aria-labelledby="keyboard-heading" className="space-y-4">
        <h2 id="keyboard-heading" className="text-2xl font-semibold">
          Keyboard Navigation Testing
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Button Focus Testing</CardTitle>
              <CardDescription>
                Test keyboard navigation between buttons with Tab key.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Button</Button>
                <Button variant="link">Link Button</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm">Small Button</Button>
                <Button variant="default">Default Size</Button>
                <Button variant="default" size="lg">Large Button</Button>
                <Button variant="default" size="icon" aria-label="Icon Button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14"></path>
                    <path d="M5 12h14"></path>
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Controls Testing</CardTitle>
              <CardDescription>
                Test form controls with keyboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name
                    <span aria-hidden="true" className="text-destructive"> *</span>
                    <span className="sr-only"> required</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                    <span aria-hidden="true" className="text-destructive"> *</span>
                    <span className="sr-only"> required</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    aria-required="true"
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <Button type="submit">Submit Form</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Complex Component Testing */}
      <section aria-labelledby="components-heading" className="space-y-4">
        <h2 id="components-heading" className="text-2xl font-semibold">
          Complex Component Testing
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tabs Testing</CardTitle>
              <CardDescription>
                Test keyboard navigation with arrow keys.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">First Tab</TabsTrigger>
                  <TabsTrigger value="tab2">Second Tab</TabsTrigger>
                  <TabsTrigger value="tab3">Third Tab</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <p className="py-4">
                    This is the content for the first tab. You can navigate between tabs
                    using left and right arrow keys.
                  </p>
                </TabsContent>
                <TabsContent value="tab2">
                  <p className="py-4">
                    This is the content for the second tab. Keyboard users can navigate
                    here with arrow keys.
                  </p>
                </TabsContent>
                <TabsContent value="tab3">
                  <p className="py-4">
                    This is the content for the third tab. Screen readers will announce
                    tab changes.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accordion Testing</CardTitle>
              <CardDescription>
                Test expandable content with keyboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    First Accordion Item
                  </AccordionTrigger>
                  <AccordionContent>
                    This is the content for the first accordion item. You can expand or
                    collapse this content using the Enter or Space key.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Second Accordion Item
                  </AccordionTrigger>
                  <AccordionContent>
                    The accordion component includes proper ARIA attributes to make it
                    accessible to screen reader users.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Third Accordion Item
                  </AccordionTrigger>
                  <AccordionContent>
                    Screen readers will announce the expanded/collapsed state of each
                    accordion item.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Dialog Testing</CardTitle>
            <CardDescription>
              Test modal dialog with keyboard accessibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Dialogs should trap focus within them when open and return focus to the trigger
              button when closed. You should be able to close the dialog with the Escape key.
            </p>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent aria-labelledby="dialog-title" aria-describedby="dialog-description">
                <DialogHeader>
                  <DialogTitle id="dialog-title">Accessible Dialog</DialogTitle>
                  <DialogDescription id="dialog-description">
                    This dialog traps focus within it while open. Try using Tab to navigate
                    the focusable elements inside.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>
                    Press Tab to navigate through the focusable elements in this dialog.
                    Focus should be trapped within the dialog until it is closed.
                  </p>
                  <div className="mt-4">
                    <Input placeholder="Try focusing this input" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setDialogOpen(false);
                    toast.success("Action completed");
                    announce("Dialog action completed", "polite");
                  }}>
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>

      {/* Color Contrast Testing */}
      <section aria-labelledby="contrast-heading" className="space-y-4">
        <h2 id="contrast-heading" className="text-2xl font-semibold">
          Color Contrast Testing
        </h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Text Color Contrast</CardTitle>
            <CardDescription>
              Test color contrast of different text styles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Standard Text Colors</h3>
              <p className="text-foreground">
                Default text color on background (should meet 4.5:1 ratio)
              </p>
              <p className="text-muted-foreground">
                Muted text color on background (should meet 4.5:1 ratio)
              </p>
              <p className="text-primary">
                Primary text color on background (should meet 4.5:1 ratio)
              </p>
              <p className="text-secondary-foreground bg-secondary p-2 rounded">
                Secondary foreground on secondary background
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">State Colors</h3>
              <p className="text-destructive">
                Destructive text color on background
              </p>
              <div className="p-4 bg-primary text-primary-foreground rounded">
                Primary foreground on primary background
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded">
                Secondary foreground on secondary background
              </div>
              <div className="p-4 bg-accent text-accent-foreground rounded">
                Accent foreground on accent background
              </div>
            </div>
            
            <Button onClick={runContrastAudit}>
              Run Contrast Audit
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Screen Reader Announcements */}
      <section aria-labelledby="screen-reader-heading" className="space-y-4">
        <h2 id="screen-reader-heading" className="text-2xl font-semibold">
          Screen Reader Testing
        </h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Screen Reader Announcements</CardTitle>
            <CardDescription>
              Test screen reader announcements for dynamic content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Live Region Announcements</h3>
              <p>
                Click the buttons below to trigger announcements that should be read by screen readers.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => {
                    announce("This is a polite announcement", "polite");
                    toast.info("Polite announcement triggered");
                  }}
                >
                  Polite Announcement
                </Button>
                
                <Button 
                  onClick={() => {
                    announce("This is an assertive announcement", "assertive");
                    toast.warning("Assertive announcement triggered");
                  }}
                >
                  Assertive Announcement
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Hidden Content</h3>
              <p>
                The following text has content that is only available to screen readers.
              </p>
              
              <div className="border p-4 rounded">
                <p>
                  This chart shows 
                  <span className="sr-only">
                    quarterly revenue data for the fiscal year 2023, with an upward trend from Q1 to Q4
                  </span>
                  <span aria-hidden="true">
                    revenue data for 2023
                  </span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
