"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export function ClerkSignIn() {
  // Use Next.js client-side hooks for searchParams
  const searchParams = useSearchParams();

  // Safely get the redirect_url parameter
  const defaultRedirectUrl = "/dashboard";
  const redirectUrl = searchParams?.get("redirect_url") || defaultRedirectUrl;

  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "shadow-none w-full p-0",
          header: "hidden", // Hide default header as we provide our own
          footer: "pb-0",
          formFieldLabel: "text-foreground",
          formFieldInput:
            "bg-background text-foreground border-border focus:border-ring touch-target",
          formFieldLabelRow:
            "focus-within:ring-2 focus-within:ring-ring rounded-sm",
          formFieldInput__focus: "outline-none ring-2 ring-ring ring-offset-2",
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-primary-foreground touch-target",
          socialButtonsBlockButton: "touch-target",
          socialButtonsBlockButtonText: "text-foreground",
          socialButtonsBlockButtonIconBox: "text-foreground",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          formFieldAction: "text-primary hover:text-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
          footerActionText: "text-muted-foreground",
        },
      }}
      routing="path"
      path="/sign-in/[[...index]]"
      signUpUrl="/sign-up"
      redirectUrl={redirectUrl}
      afterSignInUrl={redirectUrl}
      aria-labelledby="sign-in-heading"
      aria-describedby="sign-in-description"
    />
  );
}
