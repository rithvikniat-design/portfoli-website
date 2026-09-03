import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const about = await prisma.about.findFirst();
  return NextResponse.json(about || {});
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  
  let about = await prisma.about.findFirst();
  if (about) {
    about = await prisma.about.update({
      where: { id: about.id },
      data: {
        bio: body.bio || null,
        portrait: body.portrait || null,
        awards: body.awards || null,
        press: body.press || null,
        collaborators: body.collaborators || null,
      },
    });
  } else {
    about = await prisma.about.create({
      data: {
        bio: body.bio || null,
        portrait: body.portrait || null,
        awards: body.awards || null,
        press: body.press || null,
        collaborators: body.collaborators || null,
      },
    });
  }

  return NextResponse.json(about);
}
