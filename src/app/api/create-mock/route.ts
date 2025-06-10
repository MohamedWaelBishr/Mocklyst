"use server";
import { NextRequest, NextResponse } from "next/server";
import { generateUniqueId } from "@/lib/mock-generator";
import { CreateMockRequest, MockEndpoint } from "@/types";
import fs from "fs";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "data", "mocks");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMockRequest = await request.json();

    // Validate request
    if (!body.type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      );
    }

    if (
      (body.type === "object" || body.type === "array") &&
      !body.fields?.length
    ) {
      return NextResponse.json(
        { error: "Fields are required for object and array types" },
        { status: 400 }
      );
    }

    // Generate unique ID and create endpoint
    const id = generateUniqueId();
    const endpoint = `/api/mock/${id}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create mock endpoint data
    const mockEndpoint: MockEndpoint = {
      id,
      config: {
        type: body.type,
        fields: body.fields,
        length: body.length,
        primitiveType: body.primitiveType,
        primitiveValue: body.primitiveValue,
      },
      endpoint,
      createdAt: now,
      expiresAt,
    };

    // Save to file system (temporary storage)
    const filePath = path.join(STORAGE_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(mockEndpoint, null, 2));

    return NextResponse.json({
      endpoint,
      id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating mock endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
