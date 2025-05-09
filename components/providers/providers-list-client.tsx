'use client';

import { useProvidersList } from '@/hooks/providers/use-providers-list';
import { ProviderCard } from '@/components/providers/provider-card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationPrevious, 
  PaginationNext,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { ResponsiveGrid } from '@/components/ui/responsive';

interface ProvidersListClientProps {
  initialPage: number;
  initialPageSize: number;
  initialName?: string;
  initialLocation?: string;
  initialCategory?: string;
}

export function ProvidersListClient({
  initialPage,
  initialPageSize,
  initialName = '',
  initialLocation = '',
  initialCategory = '',
}: ProvidersListClientProps) {
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useProvidersList({
    page: initialPage,
    pageSize: initialPageSize,
    name: initialName,
    location: initialLocation,
    category: initialCategory,
  });
  
  // Loading state
  if (isLoading) {
    return <div className="text-center py-12">Loading providers...</div>;
  }
  
  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Error loading providers</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </div>
    );
  }
  
  // No providers state
  if (data?.providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }
  
  // Generate page numbers to show for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = Math.ceil((data?.total || 0) / initialPageSize);
    const currentPage = initialPage;
    
    // Always show first page
    pages.push(1);
    
    // Current page neighborhood
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pages[pages.length - 1] !== i - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(i);
    }
    
    // Always show last page
    if (totalPages > 1) {
      if (pages[pages.length - 1] !== totalPages - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Create base query params for pagination links
  const getQueryParams = (page: number) => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      pageSize: initialPageSize.toString() 
    });
    
    if (initialName) params.append('name', initialName);
    if (initialLocation) params.append('location', initialLocation);
    if (initialCategory) params.append('category', initialCategory);
    
    return params.toString();
  };
  
  return (
    <div>
      <ResponsiveGrid
        cols={1}
        smCols={2}
        lgCols={3}
        gap="6"
      >
        {data.providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name}
            heroImageUrl={provider.heroImageUrl || '/placeholder-image.jpg'}
            aboutSnippet={provider.aboutSnippet}
            categories={provider.categories}
          />
        ))}
      </ResponsiveGrid>
      
      {data.total > initialPageSize && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              {initialPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/providers/list?${getQueryParams(initialPage - 1)}`} />
                </PaginationItem>
              )}
              
              {getPageNumbers().map((pageNum, index) => (
                pageNum === -1 ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href={`/providers/list?${getQueryParams(pageNum)}`}
                      isActive={pageNum === initialPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              {initialPage < Math.ceil(data.total / initialPageSize) && (
                <PaginationItem>
                  <PaginationNext href={`/providers/list?${getQueryParams(initialPage + 1)}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
