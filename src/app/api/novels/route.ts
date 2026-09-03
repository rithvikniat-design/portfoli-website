import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const novels = await prisma.novel.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(novels);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = body.slug || generateSlug(body.title);
  const maxOrder = await prisma.novel.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const novel = await prisma.novel.create({
    data: {
      title: body.title,
      slug,
      coverImage: body.coverImage || null,
      genre: body.genre || null,
      pubStatus: body.pubStatus || "Forthcoming",
      synopsis: body.synopsis || null,
      excerpt: body.excerpt || null,
      buyLink: body.buyLink || null,
      isbn: body.isbn || null,
      publisher: body.publisher || null,
      featured: body.featured || false,
      status: body.status || "draft",
      order,
    },
  });

  return NextResponse.json(novel, { status: 201 });
}
