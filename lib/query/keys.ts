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
    search: ({ query, categoryId, limit }: { query?: string; categoryId?: string; limit?: number }) => 
      [...queryKeys.provider.all, 'search', query || '', categoryId || '', limit || 20] as const,
    byCategory: (categoryId: string) => [...queryKeys.provider.all, 'byCategory', categoryId] as const,
    // Dashboard-related queries
    me: () => [...queryKeys.provider.all, 'me'] as const,
    metrics: () => [...queryKeys.provider.all, 'metrics'] as const,
    metricsById: (providerId: number) => [...queryKeys.provider.all, 'metrics', providerId] as const,
    inquiries: (limit?: number) => [...queryKeys.provider.all, 'inquiries', limit] as const,
    inquiriesById: (providerId: number, limit?: number) => [...queryKeys.provider.all, 'inquiries', providerId, limit] as const,
    services: () => [...queryKeys.provider.all, 'services'] as const,
    servicesById: (providerId: number) => [...queryKeys.provider.all, 'services', providerId] as const,
  },
  
  // Bookmark-related queries
  bookmarks: {
    all: ['bookmarks'] as const,
    list: () => [...queryKeys.bookmarks.all, 'list'] as const,
    detail: () => [...queryKeys.bookmarks.all, 'detail'] as const,
  },
  
  // Review-related queries
  reviews: {
    all: ['reviews'] as const,
    byProvider: (providerId: number) => [...queryKeys.reviews.all, 'byProvider', providerId] as const,
    byCurrentProvider: (limit: number) => [...queryKeys.reviews.all, 'byProvider', 'current', limit] as const,
    byUser: (userId: string) => [...queryKeys.reviews.all, 'byUser', userId] as const,
  },
  
  // Category-related queries
  categories: {
    all: ['categories'] as const,
    public: () => [...queryKeys.categories.all, 'public'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
  },
};
