import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Cron Job handler for cleaning up expired mock endpoints
 * This function runs daily at 2 AM UTC and calls the Supabase Edge Function
 */
export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request from Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🚀 Cron job triggered: Starting cleanup process...');    // Call the Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const cleanupUrl = `${supabaseUrl}/functions/v1/cleanup-expired-mocks`;
    
    const response = await fetch(cleanupUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLEANUP_TOKEN || 'dev-cleanup-token-123'}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Edge function returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Cleanup completed successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Cleanup process completed successfully',
      ...result
    });

  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Prevent this endpoint from being called directly in production
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}
