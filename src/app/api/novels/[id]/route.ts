import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const novel = await prisma.novel.findUnique({ where: { id: params.id } });
  if (!novel) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(novel);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const novel = await prisma.novel.update({
    where: { id: params.id },
    data: {
      title: body.title,
      slug: body.slug,
      coverImage: body.coverImage || null,
      genre: body.genre || null,
      pubStatus: body.pubStatus || "Forthcoming",
      synopsis: body.synopsis || null,
      excerpt: body.excerpt || null,
      buyLink: body.buyLink || null,
      isbn: body.isbn || null,
      publisher: body.publisher || null,
      featured: body.featured ?? false,
      status: body.status || "draft",
    },
  });
  return NextResponse.json(novel);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.novel.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
}
