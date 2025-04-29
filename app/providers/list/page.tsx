import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationPrevious, 
  PaginationNext,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { 
  PROVIDER_API, 
  Provider, 
  ProvidersListResponse, 
  ApiProvider, 
  transformProvider 
} from "@/lib/api/providers";

/**
 * Props for the List page component
 * @property searchParams - In Next.js 14/15, searchParams is a Promise that must be awaited
 */
interface ListPageProps {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string;
    name?: string;
    location?: string;
    category?: string;
  }>;
}

/**
 * Response structure for providers list endpoint
 */
interface ProvidersResponse {
  providers: Provider[];
  total: number;
  page: number;
  pageSize: number;
}

// Cache revalidation time in seconds
const CACHE_REVALIDATE_TIME = 60;

/**
 * Fetches the list of providers from the API with pagination
 * Falls back to mock data if the API call fails
 * 
 * @param page - Page number (1-based)
 * @param pageSize - Number of items per page
 * @param name - Optional filter by provider name
 * @param location - Optional filter by provider location
 * @param category - Optional filter by provider category
 * @returns Processed provider data with pagination info
 */
async function getProvidersList(
  page: number = 1, 
  pageSize: number = 12,
  name: string = '',
  location: string = '',
  category: string = ''
): Promise<ProvidersResponse> {
  try {
    // Create query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      name,
      location,
      category
    });
    
    const res = await fetch(
      `${PROVIDER_API.LIST}?${params}`,
      { next: { revalidate: CACHE_REVALIDATE_TIME } }
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch providers list: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json() as ProvidersListResponse;
    
    // Transform API providers to client provider format
    const processedProviders = data.providers.map(transformProvider);
    
    return {
      providers: processedProviders,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize
    };
  } catch (error) {
    console.error('Error fetching providers list:', error instanceof Error ? error.message : String(error));
    
    // Return mock data as fallback
    return {
      providers: [
        {
          id: 1,
          name: "Sunshine Wellness Center",
          contact: null,
          location: null,
          heroImageUrl: null,
          aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing.",
          createdAt: new Date().toISOString(),
          categories: [
            { id: 2, name: "Test Category 1", icon: "test-icon-1" }
          ]
        },
        {
          id: 2,
          name: "Tech Solutions Inc",
          contact: null,
          location: null,
          heroImageUrl: null,
          aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
          createdAt: new Date().toISOString(),
          categories: [
            { id: 3, name: "Test Category 2", icon: "test-icon-1" }
          ]
        },
        {
          id: 3,
          name: "Green Earth Landscaping",
          contact: null,
          location: null,
          heroImageUrl: null,
          aboutSnippet: "Sustainable landscaping and garden design with eco-friendly practices and native plant expertise.",
          createdAt: new Date().toISOString(),
          categories: [
            { id: 2, name: "Test Category 1", icon: "test-icon-1" },
            { id: 3, name: "Test Category 2", icon: "test-icon-1" }
          ]
        }
      ],
      total: 3,
      page: page,
      pageSize: pageSize
    };
  }
}

function PaginationControls({ 
  currentPage, 
  totalPages, 
  pageSize,
  name,
  location,
  category
}: { 
  currentPage: number; 
  totalPages: number; 
  pageSize: number;
  name?: string;
  location?: string;
  category?: string;
}) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    
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
  
  const pageNumbers = getPageNumbers();
  
  // Create base query params
  const getQueryParams = (page: number) => {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    if (name) params.append('name', name);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    return params.toString();
  };
  
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`/providers/list?${getQueryParams(currentPage - 1)}`} />
          </PaginationItem>
        )}
        
        {pageNumbers.map((pageNum, index) => (
          pageNum === -1 ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNum}>
              <PaginationLink 
                href={`/providers/list?${getQueryParams(pageNum)}`}
                isActive={pageNum === currentPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={`/providers/list?${getQueryParams(currentPage + 1)}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

async function ProvidersList({ 
  page, 
  pageSize,
  name,
  location,
  category
}: { 
  page: number; 
  pageSize: number;
  name?: string;
  location?: string;
  category?: string;
}) {
  const { providers, total } = await getProvidersList(page, pageSize, name, location, category);
  
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <ResponsiveGrid
        cols={1}
        smCols={2}
        lgCols={3}
        gap="6"
      >
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name}
            heroImageUrl={provider.heroImageUrl}
            aboutSnippet={provider.aboutSnippet}
            categories={provider.categories}
          />
        ))}
      </ResponsiveGrid>
      
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <PaginationControls 
            currentPage={page} 
            totalPages={Math.ceil(total / pageSize)} 
            pageSize={pageSize}
            name={name}
            location={location}
            category={category}
          />
        </div>
      )}
    </div>
  );
}

export default async function ListPage({ searchParams }: ListPageProps) {
  // Need to await searchParams in Next.js 14+
  const params = await searchParams;
  
  // Ensure page and pageSize are valid positive integers
  const parsedPage = parseInt(params.page || "1");
  const parsedPageSize = parseInt(params.pageSize || "12");
  
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const pageSize = isNaN(parsedPageSize) || parsedPageSize < 1 ? 12 : 
                   parsedPageSize > 100 ? 100 : parsedPageSize;
  
  // Get filter parameters
  const name = params.name || '';
  const location = params.location || '';
  const category = params.category || '';
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">All Providers</h1>
          <SearchBar />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Loading providers...</div>}>
          <ProvidersList 
            page={page} 
            pageSize={pageSize} 
            name={name}
            location={location}
            category={category}
          />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
