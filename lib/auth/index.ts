/**
 * Authentication utilities index file
 * Re-exports all auth utilities for easier imports
 */

// Server-side auth utilities
export * from './server';

// The client-side utilities are not exported here
// Import them directly from './client' to avoid 
// Server Component runtime errors
