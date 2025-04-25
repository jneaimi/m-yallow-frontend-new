import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define response types
interface ProtectedUserResponse {
  userId: string;
  message: string;
}

interface ErrorResponse {
  error: string;
}

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse<ErrorResponse>(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Here you would typically fetch user data from your database
    return NextResponse.json<ProtectedUserResponse>({
      userId,
      message: 'This is protected data from the API'
    });
  } catch (error) {
    console.error('Error in protected user route:', error);
    return new NextResponse<ErrorResponse>(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
