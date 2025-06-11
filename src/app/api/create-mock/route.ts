import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateUniqueId } from "@/lib/mock-generator";
import { CreateMockRequest } from "@/types";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { schema, userId: requestUserId } = requestBody;

    // Validate that schema exists
    if (!schema) {
      return NextResponse.json(
        { error: "Missing required field: schema" },
        { status: 400 }
      );
    }

    // Extract schema properties for validation
    const body: CreateMockRequest = schema;

    // Check for Authorization header first
    const authHeader = request.headers.get("authorization");
    let user = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Extract token from Authorization header
      const token = authHeader.substring(7);
      console.log("🔍 API Route ~ Using Authorization header token");

      // Create Supabase client and verify the token
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {
              // API routes don't need to set cookies in the response for this case
            },
          },
        }
      );

      // Set the auth token and get user
      const {
        data: { user: tokenUser },
        error,
      } = await supabase.auth.getUser(token);
      if (!error && tokenUser) {
        user = tokenUser;
        console.log("🔍 API Route ~ Token authentication successful");
      } else {
        console.log(
          "🔍 API Route ~ Token authentication failed:",
          error?.message
        );
      }
    } else {
      // Fallback to cookie-based authentication
      console.log("🔍 API Route ~ No Authorization header, trying cookies");

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {
              // API routes don't need to set cookies in the response for this case
            },
          },
        }
      );

      const {
        data: { user: cookieUser },
        error,
      } = await supabase.auth.getUser();
      if (!error && cookieUser) {
        user = cookieUser;
        console.log("🔍 API Route ~ Cookie authentication successful");
      } else {
        console.log(
          "🔍 API Route ~ Cookie authentication failed:",
          error?.message
        );
      }
    }

    // Debug: Log authentication status
    console.log("🚀 ~ POST ~ User authenticated:", !!user?.id);
    console.log("🚀 ~ POST ~ User ID:", user?.id);

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
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days    // Create mock endpoint data with proper user association
    const userId = user?.id || requestUserId || null;
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
      user_id: userId, // Associate with user if authenticated
    };

    // Log the data being inserted for debugging
    console.log(
      "🚀 ~ POST ~ mockEndpointData.user_id:",
      mockEndpointData.user_id
    );
    console.log("🚀 ~ POST ~ Final userId:", userId);

    // Save to Supabase database
    if (!supabaseAdmin) {
      console.error("Supabase admin client not initialized");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

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
