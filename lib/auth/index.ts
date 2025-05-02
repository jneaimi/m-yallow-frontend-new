// This file re-exports auth functions for convenience
// For server components, import from './server'
// For client components, import from './client'

// Server-side auth is re-exported for use in server components only
export { getAuthToken } from './server';

// Client-side auth is not re-exported here to avoid accidental imports
// in server components. Import directly from './client' in client components
