import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const works = await prisma.work.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(works);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.slug || generateSlug(body.title);

  // Get max order
  const maxOrder = await prisma.work.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const work = await prisma.work.create({
    data: {
      title: body.title,
      slug,
      year: body.year ? parseInt(body.year) : null,
      role: body.role || "Director",
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
      featured: body.featured || false,
      status: body.status || "draft",
      order,
    },
  });

  return NextResponse.json(work, { status: 201 });
}
