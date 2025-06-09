#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'data', 'mocks');

function cleanupExpiredEndpoints() {
  if (!fs.existsSync(STORAGE_DIR)) {
    console.log('Storage directory does not exist.');
    return 0;
  }

  const files = fs.readdirSync(STORAGE_DIR);
  const now = new Date();
  let cleanedCount = 0;

  files.forEach(filename => {
    if (!filename.endsWith('.json')) return;

    const filePath = path.join(STORAGE_DIR, filename);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const endpoint = JSON.parse(content);
      const expiresAt = new Date(endpoint.expiresAt);

      if (now > expiresAt) {
        fs.unlinkSync(filePath);
        cleanedCount++;
        console.log(`Cleaned up expired endpoint: ${endpoint.id}`);
      }
    } catch (error) {
      console.error(`Error processing file ${filename}:`, error);
      // Remove corrupted files
      fs.unlinkSync(filePath);
      cleanedCount++;
    }
  });

  console.log(`Cleanup completed. Removed ${cleanedCount} expired endpoints.`);
  return cleanedCount;
}

cleanupExpiredEndpoints();
