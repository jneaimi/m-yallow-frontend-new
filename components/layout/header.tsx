"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
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
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserProfileButton
} from "@/components/auth";
import { AuthStateAnnouncer } from "@/components/auth/auth-state-announcer";
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
        title: "Accessibility",
        href: "/accessibility-test",
        description: "Test page for accessibility",
      },
      {
        title: "Theme",
        href: "/theme-demo",
        description: "API endpoints and usage",
      },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { isMobile } = useDeviceCategory();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Accessibility: Screen reader announcer for auth state changes */}
      <AuthStateAnnouncer />
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
          <ResponsiveStack direction="horizontal" spacing="2" align="center" className="transition-all duration-200 ease-in-out">
            {/* Auth Controls with loading state handling */}
            {!isLoaded ? (
              <HideOnMobile>
                <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
              </HideOnMobile>
            ) : isSignedIn ? (
              <UserProfileButton 
                displayMode="dropdown" 
                variant="ghost" 
                className={cn(isMobile && "touch-target")}
                profileUrl="/profile"
                settingsUrl="/settings"
              />
            ) : (
              <HideOnMobile>
                <ResponsiveStack direction="horizontal" spacing="2">
                  <SignInButton variant="ghost" size="sm" showIcon={false} />
                  <SignUpButton variant="default" size="sm" showIcon={false} />
                </ResponsiveStack>
              </HideOnMobile>
            )}

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
            {/* Auth Mobile Controls */}
            {isLoaded && (
              <div className="pt-4 mt-4 border-t">
                {isSignedIn ? (
                  <div className="space-y-3">
                    <p className="font-medium">Account</p>
                    <div className="pl-4 space-y-2 border-l border-border">
                      <Link
                        href="/profile"
                        className="block text-sm text-muted-foreground hover:text-foreground touch-target py-2"
                        onClick={toggleMobileMenu}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block text-sm text-muted-foreground hover:text-foreground touch-target py-2"
                        onClick={toggleMobileMenu}
                      >
                        Settings
                      </Link>
                      <div className="py-2">
                        <SignOutButton 
                          variant="outline" 
                          size="sm" 
                          className="w-full touch-target" 
                          showIcon={true}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <ResponsiveStack direction="horizontal" spacing="2">
                    <SignInButton
                      variant="outline"
                      size="sm"
                      className="w-full touch-target"
                      showIcon={true}
                    />
                    <SignUpButton
                      variant="default"
                      size="sm"
                      className="w-full touch-target"
                      showIcon={true}
                    />
                  </ResponsiveStack>
                )}
              </div>
            )}
          </div>
        </ShowOnMobile>
      )}
    </header>
  );
}
