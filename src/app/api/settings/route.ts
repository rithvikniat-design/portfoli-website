import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst();
  return NextResponse.json(settings || {});
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  let settings = await prisma.siteSettings.findFirst();
  if (settings) {
    settings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        siteName: body.siteName || "Director Portfolio",
        tagline: body.tagline || "",
        heroSubtitle: body.heroSubtitle || "",
        contactEmail: body.contactEmail || "",
        socialLinks: body.socialLinks || null,
      },
    });
  } else {
    settings = await prisma.siteSettings.create({
      data: {
        siteName: body.siteName || "Director Portfolio",
        tagline: body.tagline || "",
        heroSubtitle: body.heroSubtitle || "",
        contactEmail: body.contactEmail || "",
        socialLinks: body.socialLinks || null,
      },
    });
  }

  return NextResponse.json(settings);
}
