"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/ui/responsive";
import Link from "next/link";

export default function ProviderErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error("Provider page error:", error);
  }, [error]);

  return (
    <div className="py-16">
      <ResponsiveContainer>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We encountered an issue while loading this provider's information. 
            Please try again or browse other providers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/providers/search">Browse providers</Link>
            </Button>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
