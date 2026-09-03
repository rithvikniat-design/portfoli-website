import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Add images to a work
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { workId, images } = body;

  if (!workId || !images || !Array.isArray(images)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const maxOrder = await prisma.workImage.aggregate({
    where: { workId },
    _max: { order: true },
  });
  let nextOrder = (maxOrder._max.order ?? -1) + 1;

  const created = await prisma.$transaction(
    images.map((img: { url: string; alt?: string }) =>
      prisma.workImage.create({
        data: {
          workId,
          url: img.url,
          alt: img.alt || "",
          order: nextOrder++,
        },
      })
    )
  );

  return NextResponse.json(created, { status: 201 });
}

// Delete a work image
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.workImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
