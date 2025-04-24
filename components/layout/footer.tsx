"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useDeviceCategory } from "@/hooks/use-breakpoint";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
} from "@/components/ui/responsive";

type FooterColumnProps = {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
};

const FooterColumn: React.FC<FooterColumnProps> = ({ title, items }) => {
  const { isMobile } = useDeviceCategory();
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "touch-target block py-1" : ""}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

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
  const { isMobile } = useDeviceCategory();

  return (
    <footer className="w-full bg-background border-t border-border no-horizontal-overflow safe-padding-bottom">
      <ResponsiveContainer className="py-responsive">
        {/* Footer link columns - responsive grid */}
        <ResponsiveGrid
          cols={2}
          mdCols={4}
          gap="8"
          className="mb-8"
        >
          {footerLinks.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </ResponsiveGrid>

        {/* Bottom section with logo, social links and copyright */}
        <div className="pt-8 border-t border-border">
          <ResponsiveStack
            direction="vertical"
            switchToHorizontalAt="md"
            spacing="6"
            align="start"
            justify="between"
          >
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
                className={`text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "touch-target p-2" : ""}`}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "touch-target p-2" : ""}`}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "touch-target p-2" : ""}`}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link 
                href="mailto:info@example.com" 
                className={`text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "touch-target p-2" : ""}`}
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </ResponsiveStack>

          {/* Copyright and legal */}
          <div className="mt-8 pt-8 border-t border-border">
            <ResponsiveStack
              direction="vertical"
              switchToHorizontalAt="md"
              spacing="4"
              align="center"
              justify="between"
            >
              <p className="text-sm text-muted-foreground">
                © {currentYear} M-Yallow. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <Link 
                  href="/terms" 
                  className={`hover:text-foreground transition-colors ${isMobile ? "touch-target px-3 py-2" : ""}`}
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/privacy" 
                  className={`hover:text-foreground transition-colors ${isMobile ? "touch-target px-3 py-2" : ""}`}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/cookies" 
                  className={`hover:text-foreground transition-colors ${isMobile ? "touch-target px-3 py-2" : ""}`}
                >
                  Cookie Policy
                </Link>
              </div>
            </ResponsiveStack>
          </div>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
