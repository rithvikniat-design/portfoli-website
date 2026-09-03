import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, model } = await req.json();

  if (!items || !Array.isArray(items)) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  const updates = items.map((item: { id: string; order: number }) => {
    switch (model) {
      case "work":
        return prisma.work.update({ where: { id: item.id }, data: { order: item.order } });
      case "inDevProject":
        return prisma.inDevProject.update({ where: { id: item.id }, data: { order: item.order } });
      case "novel":
        return prisma.novel.update({ where: { id: item.id }, data: { order: item.order } });
      case "workImage":
        return prisma.workImage.update({ where: { id: item.id }, data: { order: item.order } });
      default:
        throw new Error("Invalid model");
    }
  });

  await prisma.$transaction(updates);

  return NextResponse.json({ success: true });
}
