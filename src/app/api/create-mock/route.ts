"use server";
import { NextRequest, NextResponse } from "next/server";
import { generateUniqueId } from "@/lib/mock-generator";
import { CreateMockRequest } from "@/types";
import { supabaseAdmin } from "@/lib/supabase";

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
    const mockEndpointData = {
      id,
      config: {
        type: body.type,
        fields: body.fields,
        length: body.length,
        primitiveType: body.primitiveType,
        primitiveValue: body.primitiveValue,
      },
      endpoint,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    };

    // Save to Supabase database
    const { error: dbError } = await supabaseAdmin
      .from("mock_endpoints")
      .insert(mockEndpointData);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save mock endpoint" },
        { status: 500 }
      );
    }

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
