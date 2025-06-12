import { supabaseAdmin } from './supabase';

export async function cleanupExpiredEndpoints() {
  try {
    // Check if admin client is available
    if (!supabaseAdmin) {
      throw new Error('Database configuration error: supabaseAdmin is not available');
    }

    // Delete expired endpoints from Supabase
    const { error, count } = await supabaseAdmin
      .from('mock_endpoints')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired endpoints:', error);
      throw error;
    }

    const cleanedCount = count || 0;
    console.log(`Cleanup completed. Removed ${cleanedCount} expired endpoints.`);
    return cleanedCount;
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
}

// Manual cleanup function that can be called directly
export async function runCleanupTask() {
  try {
    const cleanedCount = await cleanupExpiredEndpoints();
    console.log(`Manual cleanup completed. Removed ${cleanedCount} expired endpoints.`);
    return cleanedCount;
  } catch (error) {
    console.error('Manual cleanup failed:', error);
    return 0;
  }
}
