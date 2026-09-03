import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  const submission = await prisma.contactSubmission.create({
    data: {
      name: body.name,
      email: body.email,
      subject: body.subject || "",
      message: body.message,
    },
  });

  return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
}
