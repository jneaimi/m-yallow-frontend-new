"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

type FooterColumnProps = {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
};

const FooterColumn: React.FC<FooterColumnProps> = ({ title, items }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium">{title}</h3>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const footerLinks = [
  {
    title: "Product",
    items: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Support", href: "/support" },
      { title: "API", href: "/api" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
      { title: "Cookies", href: "/cookies" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {footerLinks.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>

        {/* Mobile layout */}
        <div className="grid grid-cols-2 gap-8 md:hidden mb-8">
          {footerLinks.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>

        {/* Bottom section with logo, social links and copyright */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Logo and tagline */}
            <div className="flex flex-col">
              <Link href="/" className="flex items-center space-x-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">M</span>
                </div>
                <span className="font-bold text-lg">M-Yallow</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-md">
                M-Yallow helps you build better products with cutting-edge tools and frameworks.
              </p>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link 
                href="mailto:info@example.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Copyright and legal */}
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} M-Yallow. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
