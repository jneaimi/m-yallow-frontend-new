/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { BookmarkedProviders } from '../bookmarked-providers';
import { useBookmarkedProviders, useToggleBookmark } from '@/hooks/bookmarks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { BookmarkedProvider } from '@/lib/api/bookmarks/transforms';

// Mock the hooks
jest.mock('@/hooks/bookmarks', () => ({
  useBookmarkedProviders: jest.fn(),
  useToggleBookmark: jest.fn()
}));

// Define the interface for the BookmarkedProvidersList props
interface BookmarkedProvidersListProps {
  providers: BookmarkedProvider[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onRemoveBookmark: (providerId: number) => Promise<void>;
  isRemoving: (providerId: number) => boolean;
}

// Mock the BookmarkedProvidersList component
jest.mock('../bookmarked-providers-list', () => ({
  BookmarkedProvidersList: ({ 
    providers, 
    isLoading, 
    error, 
    onRetry, 
    onRemoveBookmark, 
    isRemoving 
  }: BookmarkedProvidersListProps) => (
    <div data-testid="bookmarked-providers-list">
      <div data-testid="props-snapshot">
        {JSON.stringify({
          providersLength: providers.length,
          isLoading,
          hasError: !!error,
          canRemove: !!onRemoveBookmark,
          hasIsRemoving: !!isRemoving,
          canRetry: !!onRetry
        })}
      </div>
    </div>
  )
}));

describe('BookmarkedProviders', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (useBookmarkedProviders as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Provider 1' }],
      isLoading: false,
      error: null,
      refetch: jest.fn()
    });
    
    (useToggleBookmark as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      variables: null
    });
  });

  it('passes correct props to BookmarkedProvidersList', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BookmarkedProviders />
      </QueryClientProvider>
    );

    const propsSnapshot = JSON.parse(screen.getByTestId('props-snapshot').textContent || '{}');
    
    expect(propsSnapshot).toEqual({
      providersLength: 1,
      isLoading: false,
      hasError: false,
      canRemove: true,
      hasIsRemoving: true,
      canRetry: true
    });
  });

  it('handles loading state correctly', () => {
    (useBookmarkedProviders as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: jest.fn()
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BookmarkedProviders />
      </QueryClientProvider>
    );

    const propsSnapshot = JSON.parse(screen.getByTestId('props-snapshot').textContent || '{}');
    
    expect(propsSnapshot.isLoading).toBe(true);
  });

  it('handles error state correctly', () => {
    (useBookmarkedProviders as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Test error'),
      refetch: jest.fn()
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BookmarkedProviders />
      </QueryClientProvider>
    );

    const propsSnapshot = JSON.parse(screen.getByTestId('props-snapshot').textContent || '{}');
    
    expect(propsSnapshot.hasError).toBe(true);
  });

  it('handles empty state correctly', () => {
    (useBookmarkedProviders as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn()
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BookmarkedProviders />
      </QueryClientProvider>
    );

    const propsSnapshot = JSON.parse(screen.getByTestId('props-snapshot').textContent || '{}');
    
    expect(propsSnapshot.providersLength).toBe(0);
    expect(propsSnapshot.isLoading).toBe(false);
    expect(propsSnapshot.hasError).toBe(false);
  });
});
