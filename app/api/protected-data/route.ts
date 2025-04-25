import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get the protected data (replace with actual data fetching logic)
  const data = { 
    message: "This is protected data!",
    userId,
    timestamp: new Date().toISOString(),
    data: {
      stats: {
        visits: 1250,
        conversions: 120,
        revenue: "$12,500"
      },
      recentActivity: [
        { id: 1, action: "Login", date: "2023-04-10T15:30:00Z" },
        { id: 2, action: "Updated profile", date: "2023-04-09T11:20:00Z" },
        { id: 3, action: "Viewed dashboard", date: "2023-04-08T09:15:00Z" }
      ]
    }
  };
  
  return NextResponse.json(data);
}
