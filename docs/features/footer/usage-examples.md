# Global Footer Usage Examples

This document provides examples of how to use and customize the Global Footer component in different scenarios.

## Basic Usage

The Footer component is automatically included in the root layout and requires no additional configuration for basic usage.

```tsx
// /app/layout.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Customization Examples

### Modifying Navigation Links

#### Adding a New Category

```tsx
// /components/layout/footer.tsx
const footerLinks = [
  // Existing categories...
  
  // Add a new category
  {
    title: "Services",
    items: [
      { title: "Consulting", href: "/services/consulting" },
      { title: "Training", href: "/services/training" },
      { title: "Support", href: "/services/support" },
    ],
  },
];
```

#### Adding Links to an Existing Category

```tsx
// /components/layout/footer.tsx
const footerLinks = [
  {
    title: "Product",
    items: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Documentation", href: "/docs" },
      // Add new items
      { title: "Integrations", href: "/integrations" },
      { title: "Release Notes", href: "/release-notes" },
    ],
  },
  // Other categories...
];
```

### Customizing the Logo and Branding

```tsx
// /components/layout/footer.tsx
import Link from "next/link";

<div className="flex flex-col">
  <Link href="/" className="flex items-center space-x-2 mb-2">
    {/* Custom logo */}
    <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
      <span className="text-white font-bold">A</span>
    </div>
    <span className="font-bold text-lg">Acme Inc</span>
  </Link>
  <p className="text-sm text-muted-foreground max-w-md">
    Acme Inc provides innovative solutions to help businesses transform their operations.
  </p>
</div>
```

### Adding Custom Social Media Links

```tsx
// /components/layout/footer.tsx
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Youtube, Instagram } from "lucide-react";

// In the Footer component
<div className="flex space-x-4">
  <Link 
    href="https://github.com/your-company" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    <Github className="h-5 w-5" />
    <span className="sr-only">GitHub</span>
  </Link>
  
  {/* Adding YouTube */}
  <Link 
    href="https://youtube.com/your-channel" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    <Youtube className="h-5 w-5" />
    <span className="sr-only">YouTube</span>
  </Link>
  
  {/* Adding Instagram */}
  <Link 
    href="https://instagram.com/your-account" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    <Instagram className="h-5 w-5" />
    <span className="sr-only">Instagram</span>
  </Link>
  
  {/* Other social links... */}
</div>
```

### Customizing the Copyright Text

```tsx
// /components/layout/footer.tsx
// Get the current year for the copyright notice
const currentYear = new Date().getFullYear();

<p className="text-sm text-muted-foreground">
  © {currentYear} Acme Corporation. All rights reserved. Registered in Delaware No. 12345678.
</p>
```

## Advanced Customization

### Adding a Newsletter Signup Form

```tsx
// /components/layout/footer.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Inside the Footer component, add this section
<div className="mt-8 border-t border-border pt-8">
  <div className="max-w-md mx-auto md:mx-0">
    <h3 className="text-base font-medium mb-3">Subscribe to our newsletter</h3>
    <p className="text-sm text-muted-foreground mb-4">
      Stay up to date with the latest news, updates, and offers from our team.
    </p>
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <Input 
        type="email" 
        placeholder="Enter your email" 
        className="flex-1" 
        required 
      />
      <Button type="submit">Subscribe</Button>
    </form>
  </div>
</div>
```

### Adding a Language Selector

```tsx
// /components/layout/footer.tsx
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Inside the Footer component's bottom section
<div className="flex items-center">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="flex items-center gap-1">
        <Globe className="h-4 w-4" />
        <span>English</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>English</DropdownMenuItem>
      <DropdownMenuItem>Français</DropdownMenuItem>
      <DropdownMenuItem>Español</DropdownMenuItem>
      <DropdownMenuItem>Deutsch</DropdownMenuItem>
      <DropdownMenuItem>日本語</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

### Creating a Condensed Footer Variant

For pages that need a simpler footer, you can create a condensed variant:

```tsx
// /components/layout/condensed-footer.tsx
"use client";

import React from "react";
import Link from "next/link";

export function CondensedFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} M-Yallow. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

## Integration with Authentication

You can customize the footer based on authentication status by creating a new implementation that extends the default footer functionality:

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth"; // Your authentication hook

// Note: This is a complete replacement for the default Footer component
// Create this as a new file like 'auth-footer.tsx' and use it instead of the default Footer
export function AuthAwareFooter() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-background border-t border-border">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-8">
        {/* ... existing footer content ... */}
        
        {/* Conditional section for authenticated users */}
        {user && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-sm font-medium mb-3">Your Account</h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link 
                href="/settings" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Settings
              </Link>
              <Link 
                href="/billing" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Billing
              </Link>
              <Link 
                href="/support" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
```

## Themed Footer Variants

You can create themed footer variants for special sections of your site:

```tsx
// /components/layout/dark-footer.tsx
"use client";

import React from "react";
import { Footer } from "./footer";

export function DarkFooter() {
  return (
    <div className="bg-slate-900 text-white">
      <Footer />
    </div>
  );
}
```

## Styling the Footer for Special Pages

For landing pages or marketing pages, you might want to add special styling:

```tsx
// /app/(marketing)/layout.tsx
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
      <div className="bg-gradient-to-t from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <Footer />
      </div>
    </>
  );
}
```

These examples showcase various ways to use and customize the Footer component for different scenarios and requirements within the M-Yallow application.
