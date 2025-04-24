import { Loader2 } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="container py-responsive px-responsive">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Loading profile information...
          </p>
        </div>
        
        <div className="flex justify-center py-8" aria-live="polite" aria-busy="true">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
          <span className="sr-only">Loading profile information</span>
        </div>
      </div>
    </div>
  );
}
