import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureUploadDir();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = path.extname(file.name) || ".png";
  const baseName = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();
  const uniqueName = `${baseName}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  // Attempt image optimization with sharp
  let finalBuffer = buffer;
  let finalName = uniqueName;

  try {
    const sharp = (await import("sharp")).default;
    if (
      file.type.startsWith("image/") &&
      !file.type.includes("svg") &&
      !file.type.includes("gif")
    ) {
      finalBuffer = await sharp(buffer)
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      finalName = `${baseName}-${Date.now()}.webp`;
    }
  } catch {
    // sharp not available or image processing failed, use original
  }

  const finalPath = path.join(UPLOAD_DIR, finalName);
  await writeFile(finalPath, finalBuffer);

  const url = `/uploads/${finalName}`;

  const media = await prisma.media.create({
    data: {
      filename: finalName,
      url,
      mimeType: finalBuffer === buffer ? file.type : "image/webp",
      size: finalBuffer.length,
      alt: formData.get("alt")?.toString() || "",
    },
  });

  return NextResponse.json(media, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete file from disk
  const filePath = path.join(process.cwd(), "public", media.url);
  try {
    await unlink(filePath);
  } catch {
    // File may already be deleted
  }

  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
