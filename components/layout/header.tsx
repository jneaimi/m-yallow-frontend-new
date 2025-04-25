"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDeviceCategory } from "@/hooks/use-breakpoint";
import {
  ResponsiveContainer,
  ResponsiveStack,
  ShowOnMobile,
  HideOnMobile,
} from "@/components/ui/responsive";

type NavItem = {
  title: string;
  href: string;
  children?: {
    title: string;
    href: string;
    description?: string;
  }[];
};

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Features",
    href: "#",
    children: [
      {
        title: "Theme Demo",
        href: "/theme-demo",
        description: "Explore the theme system and its features",
      },
      {
        title: "Components",
        href: "/components",
        description: "View all available UI components",
      },
      {
        title: "Responsive Demo",
        href: "/responsive-demo",
        description: "Explore the responsive design system",
      },
    ],
  },
  {
    title: "Resources",
    href: "#",
    children: [
      {
        title: "Documentation",
        href: "/docs",
        description: "Learn how to use the system",
      },
      {
        title: "API Reference",
        href: "/api-reference",
        description: "API endpoints and usage",
      },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useDeviceCategory();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <ResponsiveContainer className="overflow-visible">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">M</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">
                M-Yallow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <HideOnMobile>
            <NavigationMenu className="z-[101]">
              <NavigationMenuList>
                {navItems.map((item) => {
                  return item.children ? (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {child.title}
                                  </div>
                                  {child.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {child.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link href={item.href}>{item.title}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </HideOnMobile>

          {/* User Controls and Theme Toggle */}
          <ResponsiveStack direction="horizontal" spacing="2" align="center">
            {/* Auth Controls */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <HideOnMobile>
                <ResponsiveStack direction="horizontal" spacing="2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="default" size="sm">
                      Sign up
                    </Button>
                  </SignUpButton>
                </ResponsiveStack>
              </HideOnMobile>
            </SignedOut>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <ShowOnMobile>
              <Button
                variant="ghost"
                size="icon"
                className="touch-target"
                aria-label="Main menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </ShowOnMobile>
          </ResponsiveStack>
        </div>
      </ResponsiveContainer>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <ShowOnMobile>
          <div
            id="mobile-navigation"
            className="flex flex-col space-y-3 px-4 py-6 bg-background border-t"
          >
            {navItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <div className="space-y-2">
                    <p className="font-medium">{item.title}</p>
                    <div className="pl-4 space-y-2 border-l border-border">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className="block text-sm text-muted-foreground hover:text-foreground touch-target py-2"
                          onClick={toggleMobileMenu}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block font-medium hover:text-primary touch-target py-2"
                    onClick={toggleMobileMenu}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <SignedOut>
              <div className="pt-4 mt-4 border-t">
                <ResponsiveStack direction="horizontal" spacing="2">
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full touch-target"
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full touch-target"
                    >
                      Sign up
                    </Button>
                  </SignUpButton>
                </ResponsiveStack>
              </div>
            </SignedOut>
          </div>
        </ShowOnMobile>
      )}
    </header>
  );
}
