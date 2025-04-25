import { Suspense } from "react";
import { SearchBar } from "@/components/providers/search-bar";
import { ProviderCard } from "@/components/providers/provider-card";
import { ResponsiveContainer, ResponsiveGrid } from "@/components/ui/responsive";
import { getProviderHeroImageUrl } from "@/lib/image-utils";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationPrevious, 
  PaginationNext,
  PaginationEllipsis
} from "@/components/ui/pagination";

/**
 * Props for the List page component
 * @property searchParams - In Next.js 14/15, searchParams is a Promise that must be awaited
 */
interface ListPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

/**
 * API response provider object with snake_case properties
 */
interface ApiProvider {
  id: number;
  name: string;
  contact?: string;
  location?: string;
  about?: string;
  hero_image_url?: string;
  created_at?: string;
}

/**
 * Processed provider object with camelCase properties for client components
 */
interface Provider {
  id: number;
  name: string;
  contact?: string;
  location?: string;
  aboutSnippet?: string;
  heroImageUrl: string;
  createdAt?: string;
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
 * @returns Processed provider data with pagination info
 */
async function getProvidersList(page: number = 1, pageSize: number = 12): Promise<ProvidersResponse> {
  // For development, use localhost API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(
      `${baseUrl}/providers?page=${page}&pageSize=${pageSize}`,
      { next: { revalidate: CACHE_REVALIDATE_TIME } }
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch providers list: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    // Map snake_case API fields to camelCase for the client component
    const processedProviders = data.providers.map((provider: ApiProvider) => ({
      id: provider.id,
      name: provider.name,
      contact: provider.contact,
      location: provider.location,
      aboutSnippet: provider.about,
      heroImageUrl: provider.hero_image_url ? provider.hero_image_url : getProviderHeroImageUrl(provider.id),
      createdAt: provider.created_at,
    }));
    
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
          heroImageUrl: getProviderHeroImageUrl(1),
          aboutSnippet: "Providing holistic wellness services with a focus on mental health and physical wellbeing.",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Tech Solutions Inc",
          contact: null,
          location: null,
          heroImageUrl: getProviderHeroImageUrl(2),
          aboutSnippet: "Cutting-edge technology solutions for businesses of all sizes. Specializing in cloud services and cybersecurity.",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Green Earth Landscaping",
          contact: null,
          location: null,
          heroImageUrl: getProviderHeroImageUrl(3),
          aboutSnippet: "Sustainable landscaping and garden design with eco-friendly practices and native plant expertise.",
          createdAt: new Date().toISOString()
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
  pageSize 
}: { 
  currentPage: number; 
  totalPages: number; 
  pageSize: number; 
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
  
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`/providers/list?page=${currentPage - 1}&pageSize=${pageSize}`} />
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
                href={`/providers/list?page=${pageNum}&pageSize=${pageSize}`}
                isActive={pageNum === currentPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={`/providers/list?page=${currentPage + 1}&pageSize=${pageSize}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

async function ProvidersList({ page, pageSize }: { page: number; pageSize: number }) {
  const { providers, total } = await getProvidersList(page, pageSize);
  
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
          />
        ))}
      </ResponsiveGrid>
      
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <PaginationControls 
            currentPage={page} 
            totalPages={Math.ceil(total / pageSize)} 
            pageSize={pageSize} 
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
  
  return (
    <div className="py-8 md:py-12">
      <ResponsiveContainer maxWidth="xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">All Providers</h1>
          <SearchBar />
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Loading providers...</div>}>
          <ProvidersList page={page} pageSize={pageSize} />
        </Suspense>
      </ResponsiveContainer>
    </div>
  );
}
