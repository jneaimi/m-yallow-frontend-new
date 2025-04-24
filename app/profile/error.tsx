"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ProfileError({
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
    const announcer = document.getElementById("profile-form-announcer");
    if (announcer) {
      announcer.textContent = "An error occurred while loading your profile. " + error.message;
    }
  }, [error]);

  return (
    <div className="container py-responsive px-responsive">
      <div className="space-y-6">
        <div 
          className="p-4 bg-destructive/10 border border-destructive rounded-md flex flex-col sm:flex-row items-start gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-3 w-full">
            <div>
              <h2 className="font-semibold text-destructive">Profile Error</h2>
              <p className="text-sm text-muted-foreground mt-1">{error.message || "An error occurred while loading your profile."}</p>
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
