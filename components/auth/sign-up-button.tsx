"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import { VariantProps } from "class-variance-authority";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    touchFriendly?: boolean;
  };

interface SignUpButtonProps extends ButtonProps {
  redirectUrl?: string;
  showIcon?: boolean;
}

export function SignUpButton({
  redirectUrl,
  showIcon = true,
  children,
  className,
  ...props
}: SignUpButtonProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  
  // Don't render if already signed in
  if (isLoaded && isSignedIn) {
    return null;
  }

  const handleClick = () => {
    router.push(redirectUrl || "/sign-up");
  };

  return (
    <Button
      onClick={handleClick}
      className={cn("", className)}
      {...props}
    >
      {showIcon && <UserPlus className="mr-2 h-4 w-4" />}
      {children || "Sign Up"}
    </Button>
  );
}
