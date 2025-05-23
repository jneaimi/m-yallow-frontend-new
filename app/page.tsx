import Link from "next/link";
import { Suspense } from "react";
import { RecentProviders } from "./providers/recent-providers";
import { SearchBar } from "@/components/providers/search-bar";
import { HybridPublicCategories } from "./providers/hybrid-public-categories";
import { ResponsiveContainer, ResponsiveStack } from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[80vh]">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <ResponsiveContainer maxWidth="xl" className="text-center">
          <ResponsiveStack direction="vertical" spacing="8" className="max-w-3xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Find the Perfect Provider for Your Needs
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with trusted professionals and services in your area
              </p>
            </div>
            
            <SearchBar className="max-w-2xl mx-auto" />
          </ResponsiveStack>
        </ResponsiveContainer>
      </section>

      {/* Categories Section - Using TanStack Query */}
      <section className="py-16">
        <ResponsiveContainer maxWidth="xl">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Browse Categories</h2>
          <HybridPublicCategories />
        </ResponsiveContainer>
      </section>

      {/* Recent Providers */}
      <section className="py-16 bg-muted/30">
        <ResponsiveContainer maxWidth="xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Recently Added Providers</h2>
            <Link href="/providers/list" className="text-primary hover:underline mt-2 md:mt-0">
              View all providers
            </Link>
          </div>
          
          <Suspense fallback={<div className="text-center py-12">Loading recent providers...</div>}>
            <RecentProviders />
          </Suspense>
        </ResponsiveContainer>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <ResponsiveContainer maxWidth="xl" className="text-center">
          <ResponsiveStack direction="vertical" spacing="6" className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Are You a Provider?</h2>
            <p className="text-xl">
              Join our platform to showcase your services and connect with potential clients
            </p>
            <div>
              <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link href="/sign-up">Register Now</Link>
              </Button>
            </div>
          </ResponsiveStack>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
