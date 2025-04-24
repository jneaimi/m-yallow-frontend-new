/**
 * JWT handling utilities for API authentication
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Extract and validate JWT token from request headers
 * @param req Next.js request object
 * @returns Object containing validation result and error message if any
 */
export async function validateJwtToken(req: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        isValid: false,
        error: "Missing or invalid authorization header"
      };
    }
    
    // Clerk handles JWT validation internally through auth.protect()
    const { userId } = auth();
    
    if (!userId) {
      return {
        isValid: false,
        error: "Invalid or expired token"
      };
    }
    
    return {
      isValid: true,
      userId
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Authentication error"
    };
  }
}

/**
 * Create an unauthorized response with proper headers and format
 * @param message Error message to include
 * @returns Formatted NextResponse with 401 status
 */
export function createUnauthorizedResponse(message: string = "Authentication required") {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message
    },
    {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
