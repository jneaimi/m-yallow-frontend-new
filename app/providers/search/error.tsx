"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/ui/responsive";

export default function SearchErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error("Provider search page error:", error);
  }, [error]);

  return (
    <div className="py-16">
      <ResponsiveContainer>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We encountered an issue while loading the providers. 
            Please try again.
          </p>
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
