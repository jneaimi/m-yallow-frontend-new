import { UserProfile } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | M-Yallow",
  description: "Manage your M-Yallow account settings",
};

export default function ProfilePage() {
  return (
    <div className="container py-responsive px-responsive">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold" id="profile-heading">Your Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base" id="profile-description">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none w-full p-0",
                navbar: "bg-background border-border",
                navbarButton: "text-foreground",
                navbarButtonActive: "text-primary border-primary",
                pageScrollBox: "p-0",
                formFieldLabel: "text-foreground",
                formFieldInput: "bg-background text-foreground border-border focus:border-ring touch-target",
                formFieldLabelRow: "focus-within:ring-2 focus-within:ring-ring rounded-sm",
                formFieldInput__focus: "outline-none ring-2 ring-ring ring-offset-2",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground touch-target",
                socialButtonsBlockButton: "touch-target",
                userPreviewMainIdentifier: "text-foreground",
                userPreviewSecondaryIdentifier: "text-muted-foreground",
                userButtonPopoverActionButton: "touch-target",
                userButtonPopoverActionButtonIcon: "text-foreground",
                userButtonPopoverActionButtonText: "text-foreground",
                userButtonPopoverFooter: "bg-background border-t border-border",
                card: "bg-transparent",
                page: "p-0",
                pageScrollBox: "p-0",
                profileSectionTitle: "text-foreground",
                profileSectionTitleText: "text-foreground font-semibold",
                profileSectionContent: "bg-transparent",
                accordionTriggerButton: "bg-background hover:bg-muted",
              },
            }}
            routing="path"
            path="/profile"
            aria-labelledby="profile-heading"
            aria-describedby="profile-description"
          />
        </div>
      </div>
    </div>
  );
}
