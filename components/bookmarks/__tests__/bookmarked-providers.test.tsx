/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BookmarkedProvidersList } from '../bookmarked-providers-list';
import { BookmarkedProvider } from '@/lib/api/bookmarks/transforms';
import userEvent from '@testing-library/user-event';

// Mock the Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the ProviderCard component
jest.mock('@/components/providers/provider-card', () => {
  return {
    ProviderCard: ({ 
      id, 
      name, 
      onRemoveBookmark,
      isRemoving
    }: { 
      id: number; 
      name: string; 
      onRemoveBookmark: (id: number) => Promise<void>;
      isRemoving: boolean;
    }) => {
      return (
        <div data-testid={`provider-card-${id}`}>
          {name}
          <button 
            onClick={() => onRemoveBookmark(id)}
            disabled={isRemoving}
            data-testid={`remove-button-${id}`}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>
      );
    },
  };
});

describe('BookmarkedProvidersList', () => {
  const mockProviders: BookmarkedProvider[] = [
    {
      id: 1,
      name: 'Provider 1',
      heroImageUrl: '/image1.jpg',
      aboutSnippet: 'About provider 1',
      categories: ['Category 1'],
      city: 'City 1',
      state: 'State 1',
    },
    {
      id: 2,
      name: 'Provider 2',
      heroImageUrl: '/image2.jpg',
      aboutSnippet: 'About provider 2',
      categories: ['Category 2'],
      city: 'City 2',
      state: 'State 2',
    },
  ];

  const mockHandlers = {
    onRetry: jest.fn(),
    onRemoveBookmark: jest.fn().mockResolvedValue(undefined),
    isRemoving: jest.fn().mockImplementation((id: number) => id === 1),
  };

  it('renders loading state', () => {
    render(
      <BookmarkedProvidersList
        providers={[]}
        isLoading={true}
        error={null}
        onRetry={mockHandlers.onRetry}
        onRemoveBookmark={mockHandlers.onRemoveBookmark}
        isRemoving={mockHandlers.isRemoving}
      />
    );

    expect(screen.getByText('Loading your saved providers')).toBeInTheDocument();
  });

  it('renders error state and allows retry', async () => {
    render(
      <BookmarkedProvidersList
        providers={[]}
        isLoading={false}
        error={new Error('Test error')}
        onRetry={mockHandlers.onRetry}
        onRemoveBookmark={mockHandlers.onRemoveBookmark}
        isRemoving={mockHandlers.isRemoving}
      />
    );

    expect(screen.getByText('Error loading bookmarks')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    await userEvent.click(retryButton);
    
    expect(mockHandlers.onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders empty state', () => {
    render(
      <BookmarkedProvidersList
        providers={[]}
        isLoading={false}
        error={null}
        onRetry={mockHandlers.onRetry}
        onRemoveBookmark={mockHandlers.onRemoveBookmark}
        isRemoving={mockHandlers.isRemoving}
      />
    );

    expect(screen.getByText('No saved providers yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse Providers' })).toHaveAttribute('href', '/providers');
  });

  it('renders providers and handles remove action', async () => {
    render(
      <BookmarkedProvidersList
        providers={mockProviders}
        isLoading={false}
        error={null}
        onRetry={mockHandlers.onRetry}
        onRemoveBookmark={mockHandlers.onRemoveBookmark}
        isRemoving={mockHandlers.isRemoving}
      />
    );

    // Check if providers are rendered
    expect(screen.getByTestId('provider-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('provider-card-2')).toBeInTheDocument();
    
    // Check if Provider 1's remove button is disabled (isRemoving returns true for id 1)
    expect(screen.getByTestId('remove-button-1')).toBeDisabled();
    
    // Check if Provider 2's remove button is enabled
    expect(screen.getByTestId('remove-button-2')).not.toBeDisabled();
    
    // Click on Provider 2's remove button
    await userEvent.click(screen.getByTestId('remove-button-2'));
    
    // Check if onRemoveBookmark was called with correct ID
    expect(mockHandlers.onRemoveBookmark).toHaveBeenCalledWith(2);
  });
});
