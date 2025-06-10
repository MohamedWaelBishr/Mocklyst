#!/usr/bin/env node

// This script can be run manually or via cron job to cleanup expired endpoints
import { runCleanupTask } from '../src/lib/cleanup.js';

async function main() {
  console.log('🧹 Starting cleanup of expired mock endpoints...');
  
  try {
    const cleanedCount = await runCleanupTask();
    
    if (cleanedCount > 0) {
      console.log(`✅ Successfully removed ${cleanedCount} expired endpoints`);
    } else {
      console.log('✅ No expired endpoints found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

main();
