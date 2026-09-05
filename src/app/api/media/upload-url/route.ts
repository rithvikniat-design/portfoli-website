import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Generate a signed upload URL so the client can upload directly to Supabase Storage
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { filename, contentType } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Generate a unique filename
    const ext = filename.split(".").pop() || "png";
    const baseName = filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    const uniqueName = `${baseName}-${Date.now()}.${ext}`;

    // Create a signed upload URL (valid for 2 minutes)
    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(uniqueName);

    if (error) {
      console.error("Signed URL error:", error);
      return NextResponse.json({ error: `Failed to create upload URL: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
      filename: uniqueName,
    });
  } catch (err: any) {
    console.error("Upload URL generation error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
