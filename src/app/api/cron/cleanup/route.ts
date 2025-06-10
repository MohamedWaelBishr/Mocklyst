import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredEndpoints } from "@/lib/cleanup";

/**
 * Vercel Cron Job handler for cleaning up expired mock endpoints
 * This function runs every hour and directly calls the cleanup function
 */
export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request from Vercel
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🚀 Cron job triggered: Starting cleanup process...");

    // Direct cleanup using the local function - more reliable than API calls
    const cleanedCount = await cleanupExpiredEndpoints();

    const result = {
      success: true,
      message: `Cleanup completed. Removed ${cleanedCount} expired endpoints.`,
      cleanedCount,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Cleanup completed successfully:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Cron job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Prevent this endpoint from being called directly in production
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}
