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
    
    // Parse request body to get the publicUrl
    const { publicUrl } = await req.json();
    
    if (!publicUrl) {
      return NextResponse.json(
        { error: 'Public URL is required' },
        { status: 400 }
      );
    }
    
    // Verify authentication
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
    
    // Call the backend API to confirm the upload
    const response = await apiClient.post(
      `/providers/${providerId}/hero-image/confirm`,
      { publicUrl }
    );
    
    // Return the response from the backend
    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error('Error confirming hero image upload:', error);
    
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