import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createApiClient } from '@/lib/api-client';

// Function to read form data from the request
async function readFormData(req: Request): Promise<{ file: { buffer: ArrayBuffer, type: string, name: string } }> {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  
  if (!file) {
    throw new Error('File is required');
  }
  
  const buffer = await file.arrayBuffer();
  
  return {
    file: { 
      buffer,
      type: file.type,
      name: file.name
    }
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    // Get provider ID from route params
    const resolvedParams = await params;
    const { providerId } = resolvedParams;
    
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
    
    // Parse the file from the form data
    const { file } = await readFormData(req);
    
    // Create buffer outside of the request for reuse
    const fileBuffer = Buffer.from(file.buffer);
    
    // Step 1: Get the upload URL from the backend with content type
    const getUrlResponse = await apiClient.post(
      `/providers/${providerId}/hero-image/url`,
      { contentType: file.type } // Pass the content type to the backend
    );
    
    const { uploadUrl, publicUrl } = getUrlResponse.data;
    
    console.log('Got pre-signed URL:', uploadUrl);
    console.log('Public URL will be:', publicUrl);
    
    try {
      // Step 2: Upload to R2 using node-fetch with minimal headers
      // This mimics what Postman does - a simple PUT with just Content-Type
      console.log('Uploading with node-fetch, file size:', fileBuffer.length);
      console.log('File content type:', file.type);
      console.log('File name:', file.name);
      
      // Extract the content type from the URL to ensure they match
      const urlContentType = new URL(uploadUrl).searchParams.get('Content-Type') || file.type;
      console.log('URL content type parameter:', urlContentType);
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': urlContentType, // Use content type from URL or fallback to file type
        },
        body: fileBuffer,
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Upload failed with status:', response.status);
        console.error('Response text:', responseText);
        throw new Error(`Upload failed with status ${response.status}: ${responseText}`);
      }
      
      // Step 3: Confirm the upload with the backend
      const confirmResponse = await apiClient.post(
        `/providers/${providerId}/hero-image/confirm`,
        { publicUrl }
      );
      
      console.log('Confirm response status:', confirmResponse.status);
      
      // Return the result to the client
      return NextResponse.json({
        success: true,
        publicUrl
      });
    } catch (uploadError) {
      console.error('Error during upload:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
  } catch (error) {
    console.error('Error in file upload:', error);
    
    // Handle specific error types
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      return NextResponse.json(
        { error: error.response.data?.message || 'Backend API error' },
        { status: error.response.status }
      );
    } else {
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }
}