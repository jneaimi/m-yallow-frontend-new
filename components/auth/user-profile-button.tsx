"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, Settings, LogOut } from "lucide-react";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    touchFriendly?: boolean;
  };

interface UserProfileButtonProps extends ButtonProps {
  profileUrl?: string;
  settingsUrl?: string;
  displayMode?: "button" | "dropdown";
  showName?: boolean;
}

export function UserProfileButton({
  profileUrl = "/profile",
  settingsUrl = "/settings",
  displayMode = "button",
  showName = false,
  className,
  variant,
  ...props
}: UserProfileButtonProps) {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signOut } = useClerk();
  
  // Don't render if not signed in
  if (authLoaded && !isSignedIn) {
    return null;
  }

  // Loading state
  if (!userLoaded) {
    return (
      <Button 
        className={cn("", className)} 
        disabled 
        variant={variant}
        {...props}
      >
        <User className="mr-2 h-4 w-4" />
        {showName && "Loading..."}
      </Button>
    );
  }

  // Simple button variant
  if (displayMode === "button") {
    return (
      <Button
        onClick={() => router.push(profileUrl)}
        className={cn("", className)}
        variant={variant}
        {...props}
      >
        {user?.imageUrl ? (
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={user.imageUrl} alt={user.firstName || "User"} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
        ) : (
          <User className="mr-2 h-4 w-4" />
        )}
        {showName && (user?.firstName || "Profile")}
      </Button>
    );
  }

  // Dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant || "ghost"}
          className={cn("rounded-full", className)}
          {...props}
        >
          <span className="sr-only">Open user menu</span>
          {user?.imageUrl ? (
            <Avatar>
              <AvatarImage src={user.imageUrl} alt={user.firstName || "User"} />
              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(profileUrl)}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(settingsUrl)}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={async () => {
            await signOut(() => router.push("/"));
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to get initials from name
function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'U';
}
