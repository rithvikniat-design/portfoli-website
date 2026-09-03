import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import path from "path";

export async function GET() {
  const { data } = await supabase.from("Media").select("*").order("createdAt", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".png";
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
  const uniqueName = `${baseName}-${Date.now()}${ext}`;
  
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

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(finalName, finalBuffer, {
      contentType: mimeType,
      upsert: false
    });

  if (uploadError) {
    console.error("Supabase storage upload error:", uploadError);
    return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 });
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(finalName);

  const url = publicUrlData.publicUrl;

  // Save to Media table
  const { data } = await supabase.from("Media").insert([{
    filename: finalName,
    url,
    mimeType,
    size: finalBuffer.length,
    alt: formData.get("alt")?.toString() || "",
  }]).select().single();

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: media } = await supabase.from("Media").select("*").eq("id", id).single();
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from Supabase Storage
  if (media.filename) {
    await supabase.storage.from("uploads").remove([media.filename]);
  }

  // Delete from Media table
  await supabase.from("Media").delete().eq("id", id);
  
  return NextResponse.json({ success: true });
}