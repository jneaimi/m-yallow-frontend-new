// Re-export server-side functions
export { 
  getUserBookmarks, 
  addBookmark, 
  removeBookmark,
  BOOKMARK_API
} from './server';

// Client-side functionality should be imported directly from './client'
