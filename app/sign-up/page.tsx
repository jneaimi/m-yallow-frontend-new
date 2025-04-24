import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | M-Yallow",
  description: "Create a new M-Yallow account",
};

export default function SignUpPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-responsive px-responsive">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold" id="sign-up-heading">Create an Account</h1>
          <p className="text-muted-foreground text-sm md:text-base" id="sign-up-description">
            Sign up to get started with M-Yallow
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none w-full p-0",
                header: "hidden", // Hide default header as we provide our own
                footer: "pb-0",
                formFieldLabel: "text-foreground",
                formFieldInput: "bg-background text-foreground border-border focus:border-ring touch-target",
                formFieldLabelRow: "focus-within:ring-2 focus-within:ring-ring rounded-sm",
                formFieldInput__focus: "outline-none ring-2 ring-ring ring-offset-2",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground touch-target",
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
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/onboarding"
            afterSignUpUrl="/onboarding"
            aria-labelledby="sign-up-heading"
            aria-describedby="sign-up-description"
          />
        </div>
      </div>
    </div>
  );
}
