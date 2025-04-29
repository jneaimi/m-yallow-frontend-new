import { ResponsiveContainer } from "@/components/ui/responsive";

export default function SearchPageLoading() {
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted rounded-md animate-pulse mb-6"></div>
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
        </div>
        
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-md"></div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
