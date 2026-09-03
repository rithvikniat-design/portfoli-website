import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const work = await prisma.work.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(work);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const work = await prisma.work.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      year: body.year ? parseInt(body.year) : null,
      role: body.role,
      logline: body.logline || null,
      description: body.description || null,
      poster: body.poster || null,
      trailerUrl: body.trailerUrl || null,
      genre: body.genre || null,
      runtime: body.runtime || null,
      festivals: body.festivals || null,
      credits: body.credits || null,
      tags: body.tags || null,
      pdfUrl: body.pdfUrl || null,
      featured: body.featured ?? false,
      status: body.status || "draft",
    },
  });

  return NextResponse.json(work);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Soft delete
  await prisma.work.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
