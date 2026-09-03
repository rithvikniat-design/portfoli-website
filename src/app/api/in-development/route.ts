import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const projects = await prisma.inDevProject.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.slug || generateSlug(body.title);
  const maxOrder = await prisma.inDevProject.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const project = await prisma.inDevProject.create({
    data: {
      title: body.title,
      slug,
      concept: body.concept || null,
      treatment: body.treatment || null,
      devStatus: body.devStatus || "Concept",
      poster: body.poster || null,
      genre: body.genre || null,
      tags: body.tags || null,
      featured: body.featured || false,
      status: body.status || "draft",
      order,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
