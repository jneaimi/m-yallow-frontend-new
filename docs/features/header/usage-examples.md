# Global Header Usage Examples

This document provides practical examples of how to work with and customize the Global Header component in the M-Yallow application.

## Basic Usage

The header is automatically included in all pages through the root layout, requiring no additional code for basic usage.

## Customization Examples

### 1. Changing Navigation Items

To modify the navigation structure, edit the `navItems` array in the Header component:

```tsx
// /components/layout/header.tsx
const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products", // Changed from "Dashboard"
    href: "/products", // Changed from "/dashboard"
  },
  {
    title: "Solutions", // New section
    href: "#",
    children: [
      {
        title: "Enterprise",
        href: "/solutions/enterprise",
        description: "Solutions for enterprise businesses",
      },
      {
        title: "Small Business",
        href: "/solutions/small-business",
        description: "Solutions for small businesses",
      },
    ],
  },
  // Other navigation items...
];
```

### 2. Replacing the Logo

To replace the default logo with a custom image:

```tsx
// /components/layout/header.tsx
import Image from "next/image";

// Inside the Header component return statement
<Link href="/" className="flex items-center space-x-2">
  <Image 
    src="/logo.svg" 
    alt="M-Yallow Logo" 
    width={32} 
    height={32} 
    className="h-8 w-auto"
  />
  <span className="font-bold text-lg hidden sm:inline-block">M-Yallow</span>
</Link>
```

### 3. Integrating with Authentication

Example of integrating with Clerk authentication:

```tsx
// /components/layout/header.tsx
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function Header() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Inside the Header component return statement
  // Replace the existing auth controls with:
  {isSignedIn ? (
    <UserButton afterSignOutUrl="/" />
  ) : (
    <div className="hidden sm:flex space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push("/sign-in")}
      >
        Login
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => router.push("/sign-up")}
      >
        Sign Up
      </Button>
    </div>
  )}
```

### 4. Adding Active State Indicators

To highlight the active navigation item based on the current route:

```tsx
// /components/layout/header.tsx
"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Inside your mapping of navigation items
  <Link 
    href={item.href} 
    className={cn(
      "block font-medium hover:text-primary",
      pathname === item.href && "text-primary font-semibold"
    )}
    onClick={toggleMobileMenu}
  >
    {item.title}
  </Link>
}
```

### 5. Adding a Search Bar

To add a search bar to the header:

```tsx
// /components/layout/header.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Inside the Header component return statement, add before the auth controls
<div className="hidden md:flex relative w-full max-w-xs mx-4">
  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input 
    type="search" 
    placeholder="Search..." 
    className="pl-8 h-9 w-full"
  />
</div>
```

### 6. Adding Notifications

To add a notifications dropdown to the header:

```tsx
// /components/layout/header.tsx
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Inside the user controls section
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      <Badge 
        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
      >
        3
      </Badge>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-80">
    <div className="flex justify-between items-center px-4 py-2 border-b">
      <h2 className="font-medium">Notifications</h2>
      <Button variant="ghost" size="sm">Mark all as read</Button>
    </div>
    <div className="py-2">
      {/* Notification items */}
      <div className="px-4 py-2 hover:bg-accent cursor-pointer">
        <p className="text-sm font-medium">New feature released</p>
        <p className="text-xs text-muted-foreground">Check out the new dashboard</p>
      </div>
      {/* More notification items... */}
    </div>
    <div className="border-t px-4 py-2">
      <Button variant="ghost" size="sm" className="w-full">
        View all notifications
      </Button>
    </div>
  </DropdownMenuContent>
</DropdownMenu>
```

### 7. Customizing Mobile Breakpoints

To adjust when the mobile menu appears:

```tsx
// /components/layout/header.tsx
// Change breakpoints from md to lg
<div className="hidden lg:flex items-center space-x-1">
  {/* Desktop navigation */}
</div>

<Button
  variant="ghost"
  size="icon"
  className="ml-2 lg:hidden"
  onClick={toggleMobileMenu}
>
  {/* Mobile menu toggle */}
</Button>

{mobileMenuOpen && (
  <div className="lg:hidden">
    {/* Mobile navigation */}
  </div>
)}
```

### 8. Adding Language Selector

To add a language selector dropdown:

```tsx
// /components/layout/header.tsx
import { Globe } from "lucide-react";

// Inside the user controls section
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Globe className="h-5 w-5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>English</DropdownMenuItem>
    <DropdownMenuItem>Français</DropdownMenuItem>
    <DropdownMenuItem>Español</DropdownMenuItem>
    <DropdownMenuItem>Deutsch</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 9. Implementing a Sticky Header with Scroll Behavior

To create a header that changes appearance on scroll:

```tsx
"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      scrolled 
        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm" 
        : "bg-transparent"
    )}>
      {/* Rest of header implementation */}
    </header>
  );
}
```

### 10. Creating a Mega Menu

To implement a more complex mega menu for a main navigation item:

```tsx
// Inside navItems array
{
  title: "Products",
  href: "#",
  children: [
    {
      title: "Analytics",
      href: "/products/analytics",
      description: "Advanced data analytics solutions",
    },
    {
      title: "Automation",
      href: "/products/automation",
      description: "Workflow automation tools",
    },
    // More items...
  ],
}

// And then in the NavigationMenuContent rendering
<NavigationMenuContent>
  <div className="w-[600px] p-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-medium mb-2 text-sm">Core Solutions</h3>
        <ul className="space-y-1">
          {item.children.slice(0, 3).map((child) => (
            <li key={child.title}>
              <NavigationMenuLink asChild>
                <Link
                  href={child.href}
                  className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  {child.title}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-2 text-sm">Additional Solutions</h3>
        <ul className="space-y-1">
          {item.children.slice(3).map((child) => (
            <li key={child.title}>
              <NavigationMenuLink asChild>
                <Link
                  href={child.href}
                  className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  {child.title}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t">
      <Link 
        href="/products" 
        className="text-sm font-medium text-primary hover:underline"
      >
        View all products →
      </Link>
    </div>
  </div>
</NavigationMenuContent>
```

## Testing Examples

### 1. Basic Component Test

Example of testing the header component with React Testing Library:

```tsx
// /components/layout/header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './header';

describe('Header component', () => {
  it('renders the logo', () => {
    render(<Header />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });
  
  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Header />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    
    // Menu should be closed initially
    expect(screen.queryByText('Login')).not.toBeVisible();
    
    // Open the menu
    fireEvent.click(hamburger);
    expect(screen.getByText('Login')).toBeVisible();
    
    // Close the menu
    fireEvent.click(hamburger);
    expect(screen.queryByText('Login')).not.toBeVisible();
  });
});
```

### 2. Testing Active Links

```tsx
// Assuming usePathname returns "/dashboard"
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: jest.fn() }),
}));

it('highlights the active link', () => {
  render(<Header />);
  
  // Find all navigation links
  const links = screen.getAllByRole('link');
  
  // Find the Dashboard link
  const dashboardLink = links.find(link => link.textContent === 'Dashboard');
  
  // Check if it has the active class
  expect(dashboardLink).toHaveClass('text-primary');
});
```
