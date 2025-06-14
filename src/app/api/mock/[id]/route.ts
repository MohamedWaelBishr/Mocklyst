"use server";
import { NextRequest, NextResponse } from "next/server";
import { generateMockData } from "@/lib/mock-generator";
import { supabaseAdmin } from "@/lib/supabase";

// Atomic increment function for hit tracking using raw SQL
async function incrementHits(endpointId: string): Promise<void> {
  try {
    if (!supabaseAdmin) {
      console.error("Supabase admin client not available for hit tracking");
      return;
    }

    // Use database function for atomic increment (will create if needed)
    const { error } = await supabaseAdmin.rpc('increment_endpoint_hits', {
      endpoint_id: endpointId
    });

    if (error && error.code === '42883') {
      // Function doesn't exist, fall back to fetch-and-update
      const { data: current, error: fetchError } = await supabaseAdmin
        .from("mock_endpoints")
        .select("hits")
        .eq("id", endpointId)
        .single();

      if (!fetchError && current) {
        await supabaseAdmin
          .from("mock_endpoints")
          .update({ hits: current.hits + 1 })
          .eq("id", endpointId);
      }
    } else if (error) {
      throw error;
    }
  } catch (error) {
    // Log error but don't throw to avoid affecting response
    console.error("Failed to increment hits for endpoint:", endpointId, error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing endpoint ID" },
        { status: 400 }
      );
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Load mock endpoint configuration from Supabase
    const { data: mockEndpoint, error: dbError } = await supabaseAdmin
      .from("mock_endpoints")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError || !mockEndpoint) {
      return NextResponse.json(
        { error: "Mock endpoint not found" },
        { status: 404 }
      );
    }

    // Check if endpoint has expired
    const now = new Date();
    const expiresAt = new Date(mockEndpoint.expires_at);

    if (now > expiresAt) {
      // Clean up expired endpoint
      await supabaseAdmin.from("mock_endpoints").delete().eq("id", id);

      return NextResponse.json(
        { error: "Mock endpoint has expired" },
        { status: 410 }
      );
    }    // Generate mock data based on schema
    const mockData = generateMockData(mockEndpoint.config);

    // Increment hits asynchronously (don't block response)
    incrementHits(id).catch((error) => {
      console.error("Error incrementing hits for endpoint:", id, error);
    });

    // Set CORS headers to allow cross-origin requests
    const response = NextResponse.json(mockData);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error serving mock data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Handle preflight CORS requests
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing endpoint ID" },
        { status: 400 }
      );
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Check if mock endpoint exists in database
    const { data: mockEndpoint, error: selectError } = await supabaseAdmin
      .from("mock_endpoints")
      .select("id")
      .eq("id", id)
      .single();

    if (selectError || !mockEndpoint) {
      return NextResponse.json(
        { error: "Mock endpoint not found" },
        { status: 404 }
      );
    }

    // Delete the mock endpoint from database
    const { error: deleteError } = await supabaseAdmin
      .from("mock_endpoints")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete mock endpoint" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mock endpoint deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting mock endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
