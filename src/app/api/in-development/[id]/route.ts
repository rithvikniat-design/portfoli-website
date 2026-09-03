import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const project = await prisma.inDevProject.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const project = await prisma.inDevProject.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      concept: body.concept || null,
      treatment: body.treatment || null,
      devStatus: body.devStatus || "Concept",
      poster: body.poster || null,
      genre: body.genre || null,
      tags: body.tags || null,
      featured: body.featured ?? false,
      status: body.status || "draft",
    },
  });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.inDevProject.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}
