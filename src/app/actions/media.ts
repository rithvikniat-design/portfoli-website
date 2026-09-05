"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import path from "path";

export async function uploadMediaAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

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
  console.log("Attempting to upload to Supabase...");
  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(finalName, finalBuffer, {
      contentType: mimeType,
      upsert: false
    });

  if (uploadError) {
    console.error("Supabase storage upload error:", uploadError);
    throw new Error("Failed to upload to storage: " + uploadError.message);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(finalName);

  const url = publicUrlData.publicUrl;
  console.log("Uploaded successfully, URL:", url);

  // Save to Media table
  console.log("Saving to Media table...");
  const { data, error: dbError } = await supabase.from("Media").insert([{
    filename: finalName,
    url,
    mimeType,
    size: finalBuffer.length,
    alt: formData.get("alt")?.toString() || "",
  }]).select().single();

  if (dbError) {
    console.error("Database insert error:", dbError);
    throw new Error("Failed to save to database: " + dbError.message);
  }

  return data;
}
