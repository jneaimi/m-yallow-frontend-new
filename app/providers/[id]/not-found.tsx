import Link from "next/link";
import { ResponsiveContainer } from "@/components/ui/responsive";
import { Button } from "@/components/ui/button";

export default function ProviderNotFound() {
  return (
    <div className="py-16 md:py-24">
      <ResponsiveContainer maxWidth="xl" className="text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">Provider Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The provider you're looking for doesn't exist or may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/providers/list">Browse All Providers</Link>
            </Button>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
