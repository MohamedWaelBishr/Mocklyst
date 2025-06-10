"use server";
import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredEndpoints } from "@/lib/cleanup";

export async function POST(request: NextRequest) {
  try {
    // Simple authentication check (in production, use proper auth)
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CLEANUP_TOKEN || "default-cleanup-token";

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cleanedCount = await cleanupExpiredEndpoints();

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Removed ${cleanedCount} expired endpoints.`,
      cleanedCount,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Cleanup endpoint. Use POST with proper authorization.",
  });
}
