import { NextRequest, NextResponse } from 'next/server';
import { createServerApiClient } from '@/lib/api-client/server';
import { auth } from '@clerk/nextjs';

/**
 * POST /api/providers/categories
 * Update categories for the current provider
 */
export async function POST(request: NextRequest) {
  try {
    // Get the user ID from auth
    const { userId } = auth();
    
    // If no user is authenticated, return 401
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body (array of category IDs)
    const categoryIds = await request.json();
    
    // Validate the input
    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: 'Invalid request: categoryIds must be an array' },
        { status: 400 }
      );
    }
    
    // Create a server API client
    const apiClient = await createServerApiClient();
    
    // Forward the request to the backend
    await apiClient.post('/providers/categories', categoryIds);
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating provider categories:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Forward the error status and message from the backend
      return NextResponse.json(
        { error: error.response.data.error || 'Failed to update provider categories' },
        { status: error.response.status || 500 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}