/**
 * This file defines the query keys used throughout the application.
 * Using this centralized approach ensures consistency and makes it easier to
 * invalidate related queries when needed.
 */

export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    details: () => [...queryKeys.user.all, 'details'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
  },
  
  // Provider-related queries
  provider: {
    all: ['provider'] as const,
    list: (params?: Record<string, any>) => [...queryKeys.provider.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.provider.all, 'detail', id] as const,
    search: (query: string) => [...queryKeys.provider.all, 'search', query] as const,
    byCategory: (categoryId: string) => [...queryKeys.provider.all, 'byCategory', categoryId] as const,
  },
  
  // Bookmark-related queries
  bookmarks: {
    all: ['bookmarks'] as const,
    list: () => [...queryKeys.bookmarks.all, 'list'] as const,
  },
  
  // Review-related queries
  reviews: {
    all: ['reviews'] as const,
    byProvider: (providerId: number) => [...queryKeys.reviews.all, 'byProvider', providerId] as const,
    byUser: (userId: string) => [...queryKeys.reviews.all, 'byUser', userId] as const,
  },
  
  // Category-related queries
  categories: {
    all: ['categories'] as const,
    public: () => [...queryKeys.categories.all, 'public'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
  },
};
