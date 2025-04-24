"use client";

import * as React from "react";
import { 
  SignInButton, 
  SignUpButton, 
  SignOutButton, 
  UserProfileButton 
} from "@/components/auth";

/**
 * Example component showing how to use the authentication buttons
 * This is for demonstration purposes only and not intended for production use
 */
export function AuthButtonsExample() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Basic Authentication Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <SignInButton />
          <SignUpButton />
          <SignOutButton />
          <UserProfileButton />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Customized Authentication Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <SignInButton variant="outline" showIcon={false}>
            Login
          </SignInButton>
          
          <SignUpButton variant="secondary">
            Create Account
          </SignUpButton>
          
          <SignOutButton variant="ghost" showIcon={false}>
            Logout
          </SignOutButton>
          
          <UserProfileButton displayMode="dropdown" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Different Button Variants</h2>
        <div className="flex flex-wrap gap-2">
          <SignInButton variant="default" />
          <SignInButton variant="destructive" />
          <SignInButton variant="outline" />
          <SignInButton variant="secondary" />
          <SignInButton variant="ghost" />
          <SignInButton variant="link" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">User Profile Button Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <UserProfileButton displayMode="button" />
          <UserProfileButton displayMode="button" showName />
          <UserProfileButton displayMode="dropdown" />
          <UserProfileButton displayMode="dropdown" variant="outline" />
        </div>
      </div>
    </div>
  );
}
