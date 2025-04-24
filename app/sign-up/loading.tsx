import { Loader2 } from "lucide-react";

export default function SignUpLoading() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-responsive px-responsive">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Loading sign up form...
          </p>
        </div>
        
        <div className="flex justify-center py-8" aria-live="polite" aria-busy="true">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
          <span className="sr-only">Loading sign up form</span>
        </div>
      </div>
    </div>
  );
}
