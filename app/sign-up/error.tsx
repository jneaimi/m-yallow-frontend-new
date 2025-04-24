"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function SignUpError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    
    // Announce error to screen readers
    const announcer = document.getElementById("auth-form-announcer");
    if (announcer) {
      announcer.textContent = "An error occurred during sign up. " + error.message;
    }
  }, [error]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-responsive px-responsive">
      <div className="w-full max-w-md space-y-6">
        <div 
          className="p-4 bg-destructive/10 border border-destructive rounded-md flex flex-col sm:flex-row items-start gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-3 w-full">
            <div>
              <h2 className="font-semibold text-destructive">Registration Error</h2>
              <p className="text-sm text-muted-foreground mt-1">{error.message || "An error occurred during sign up."}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={reset}
              className="text-sm touch-target w-full sm:w-auto"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
