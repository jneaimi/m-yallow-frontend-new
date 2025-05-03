import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-client';
import { currentUser, auth } from '@clerk/nextjs/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    // Get provider ID from route params
    const resolvedParams = await params;
    const { providerId } = resolvedParams;
    
    // Verify authentication using auth()
    const authObj = await auth();
    
    if (!authObj.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get auth token
    const token = await authObj.getToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      );
    }
    
    // Create API client with token
    const apiClient = await createApiClient(token);
    
    // Parse the request body to get the content type if provided
    let contentType;
    try {
      const body = await req.json();
      contentType = body.contentType;
    } catch (e) {
      // No request body or invalid JSON, use default content type
      console.log('No content type provided in request body');
    }
    
    // Call the backend API to get the upload URL
    const response = await apiClient.post(
      `/providers/${providerId}/hero-image/url`,
      contentType ? { contentType } : undefined
    );
    
    // Return the response from the backend
    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error('Error getting hero image upload URL:', error);
    
    // Handle specific error types
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return NextResponse.json(
        { error: error.response.data.message || 'Backend API error' },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      return NextResponse.json(
        { error: 'No response from backend API' },
        { status: 503 }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }
}