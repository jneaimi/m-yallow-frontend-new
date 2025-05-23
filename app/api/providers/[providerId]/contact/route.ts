import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api/providers';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(
  request: NextRequest,
  { params }: { params: { providerId: string } }
) {
  try {
    const providerId = params.providerId;
    const requestData = await request.json();
    
    // Sanitize input data
    const sanitizedData = sanitizeObject(requestData);
    
    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Forward request to backend API
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData),
    });

    // Handle various error responses from the API
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to send message' },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Provider contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
