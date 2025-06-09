import { NextRequest, NextResponse } from 'next/server';
import { generateMockData } from '@/lib/mock-generator';
import { MockEndpoint } from '@/types';
import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'data', 'mocks');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing endpoint ID' },
        { status: 400 }
      );
    }

    // Load mock endpoint configuration
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Mock endpoint not found' },
        { status: 404 }
      );
    }

    const mockEndpointData = fs.readFileSync(filePath, 'utf-8');
    const mockEndpoint: MockEndpoint = JSON.parse(mockEndpointData);

    // Check if endpoint has expired
    const now = new Date();
    const expiresAt = new Date(mockEndpoint.expiresAt);
    
    if (now > expiresAt) {
      // Clean up expired endpoint
      fs.unlinkSync(filePath);
      return NextResponse.json(
        { error: 'Mock endpoint has expired' },
        { status: 410 }
      );
    }

    // Generate mock data based on schema
    const mockData = generateMockData(mockEndpoint.config);

    // Set CORS headers to allow cross-origin requests
    const response = NextResponse.json(mockData);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error serving mock data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle preflight CORS requests
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
