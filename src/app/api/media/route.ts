import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const { data } = await supabase.from("Media").select("*").order("createdAt", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") || "";

    // Handle JSON metadata save (from direct-to-storage upload flow)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { filename, url, mimeType, size, alt } = body;

      if (!filename || !url) {
        return NextResponse.json({ error: "filename and url are required" }, { status: 400 });
      }

      const { data, error: dbError } = await supabase.from("Media").insert([{
        filename,
        url,
        mimeType: mimeType || "image/png",
        size: size || 0,
        alt: alt || "",
      }]).select().single();

      if (dbError) {
        console.error("Database insert error:", dbError);
        return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    }

    // Handle legacy FormData upload (for small files under 4.5MB)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
    const uniqueName = `${baseName}-${Date.now()}.${ext}`;
    
    let finalBuffer: any = buffer;
    let finalName = uniqueName;
    let mimeType = file.type;

    try {
      const sharp = (await import("sharp")).default;
      if (file.type.startsWith("image/") && !file.type.includes("svg") && !file.type.includes("gif")) {
        finalBuffer = await sharp(buffer as any)
          .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
        finalName = `${baseName}-${Date.now()}.webp`;
        mimeType = "image/webp";
      }
    } catch (error) {
      console.error("Sharp processing failed, falling back to original file:", error);
    }

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(finalName, finalBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(finalName);

    const url = publicUrlData.publicUrl;

    const { data, error: dbError } = await supabase.from("Media").insert([{
      filename: finalName,
      url,
      mimeType,
      size: finalBuffer.length,
      alt: formData.get("alt")?.toString() || "",
    }]).select().single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: media } = await supabase.from("Media").select("*").eq("id", id).single();
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (media.filename) {
    await supabase.storage.from("uploads").remove([media.filename]);
  }

  await supabase.from("Media").delete().eq("id", id);
  
  return NextResponse.json({ success: true });
}