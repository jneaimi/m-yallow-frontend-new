"use client";

import * as React from "react";
import { useState } from "react";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { announceAuthStateChange } from "@/lib/accessibility/auth";
import { VariantProps } from "class-variance-authority";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    touchFriendly?: boolean;
  };

interface SignOutButtonProps extends ButtonProps {
  redirectUrl?: string;
  showIcon?: boolean;
}

export function SignOutButton({
  redirectUrl = "/",
  showIcon = true,
  children,
  className,
  ...props
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Don't render if not signed in
  if (isLoaded && !isSignedIn) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut(() => {
        router.push(redirectUrl);
      });
      // Note: The AuthStateAnnouncer will handle the announcement
    } catch (error) {
      console.error("Error signing out:", error);
      announceAuthStateChange("Sign out failed. Please try again.", "assertive");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      className={cn("", className)}
      disabled={isSigningOut}
      aria-busy={isSigningOut ? "true" : undefined}
      {...props}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {isSigningOut ? "Signing out..." : children || "Sign Out"}
    </Button>
  );
}
