"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorComponent({
  error,
  reset,
  title,
  contextMessage,
  announcerId,
  containerClassName,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  contextMessage: string;
  announcerId: string;
  containerClassName?: string;
}) {
  const announcerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    
    // Announce error to screen readers
    if (announcerRef.current) {
      announcerRef.current.textContent = contextMessage + " " + error.message;
    }
  }, [error, contextMessage]);
  
  useEffect(() => {
    announcerRef.current = document.getElementById(announcerId) as HTMLDivElement;
  }, [announcerId]);

  return (
    <div className={`container ${containerClassName || "py-responsive px-responsive"}`}>
      <div className="w-full max-w-md space-y-6">
        <div 
          className="p-4 bg-destructive/10 border border-destructive rounded-md flex flex-col sm:flex-row items-start gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-3 w-full">
            <div>
              <h2 className="font-semibold text-destructive">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{error.message || contextMessage}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={reset}
              className="text-sm touch-target w-full sm:w-auto"
              aria-label={`Try again with ${title.toLowerCase()}`}
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}