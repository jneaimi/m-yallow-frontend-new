// Re-export server-side functions and types
export { 
  getProviderReviews, 
  getUserReviews, 
  addReview,
  updateReview,
  deleteReview,
  REVIEW_API,
  type Review
} from './server';

// Client-side functionality should be imported directly from './client'
