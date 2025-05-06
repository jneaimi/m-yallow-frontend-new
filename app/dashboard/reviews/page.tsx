// Define props to accept searchParams
interface UserReviewsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Make the component async to properly await searchParams
export default async function UserReviewsPage({ searchParams }: UserReviewsPageProps) {
  // Extract and parse providerId from searchParams
  const providerIdParam = searchParams?.providerId;
  const providerId = typeof providerIdParam === 'string' ? parseInt(providerIdParam, 10) : NaN;
  const isValidProviderId = !isNaN(providerId) && providerId > 0;

  // Pass the parsed providerId to the client component
  return <ReviewsDisplay providerId={isValidProviderId ? providerId : 0} />;
}

// We need to import the ReviewsDisplay component from the same file
// to avoid circular dependencies
import { ReviewsDisplay } from './reviews-display';
