"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User } from "lucide-react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for auth state

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // For demonstration purposes
  const toggleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">M-Yallow</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => {
                return item.children ? (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
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
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink>
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Controls and Theme Toggle */}
        <div className="flex items-center space-x-2">
          {/* Auth Controls */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={toggleAuth}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleAuth}>
                Login
              </Button>
              <Button variant="default" size="sm" onClick={toggleAuth}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-3 px-4 py-6 bg-background border-t">
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
                          className="block text-sm text-muted-foreground hover:text-foreground"
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
                    className="block font-medium hover:text-primary"
                    onClick={toggleMobileMenu}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            {!isLoggedIn && (
              <div className="pt-4 mt-4 border-t flex space-x-2">
                <Button variant="outline" size="sm" onClick={toggleAuth} className="w-full">
                  Login
                </Button>
                <Button variant="default" size="sm" onClick={toggleAuth} className="w-full">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
