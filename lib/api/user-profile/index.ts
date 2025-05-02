// Re-export server-side functions and types
export { 
  getUserProfile, 
  updateUserProfile, 
  USER_PROFILE_API,
  type UserProfile
} from './server';

// Client-side functionality should be imported directly from './client'
