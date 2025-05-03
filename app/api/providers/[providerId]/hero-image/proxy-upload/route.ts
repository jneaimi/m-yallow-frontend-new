import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

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
    
    // Parse the request body
    const body = await req.json();
    const { url, contentType } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    console.log('Proxying upload to URL:', url);
    console.log('Content-Type:', contentType || 'image/jpeg');
    
    try {
      // Read the file from the frontend upload request
      const fileData = await req.arrayBuffer();
      console.log('Got file data, size:', fileData.byteLength);
      
      // Create a new instance of axios without default headers
      const uploadClient = axios.create();
      
      // Make direct upload request to R2 with exact content type
      const uploadResponse = await uploadClient.put(
        url,
        Buffer.from(fileData),
        {
          headers: {
            'Content-Type': contentType || 'image/jpeg',
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      
      console.log('Upload successful with status:', uploadResponse.status);
      
      return NextResponse.json({ 
        success: true, 
        message: 'File uploaded successfully',
        status: uploadResponse.status
      });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      
      // If there's a response, include it in the error
      if (uploadError.response) {
        console.error('Error response data:', uploadError.response.data);
        console.error('Error response status:', uploadError.response.status);
        console.error('Error response headers:', uploadError.response.headers);
        
        return NextResponse.json(
          { 
            error: 'Upload failed', 
            details: uploadError.response.data,
            status: uploadError.response.status 
          },
          { status: uploadError.response.status }
        );
      }
      
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error in proxy upload:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}