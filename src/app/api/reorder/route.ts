import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, items } = await req.json();

  if (!type || !items || !Array.isArray(items)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const modelMap: Record<string, string> = {
    works: "Work",
    novels: "Novel",
    inDev: "InDevProject",
  };

  const model = modelMap[type];
  if (!model) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Supabase doesn't have bulk upsert for dynamic updates as easily as Prisma transaction
  // so we update them in a loop
  for (const item of items) {
    await supabase.from(model).update({ order: item.order }).eq("id", item.id);
  }

  return NextResponse.json({ success: true });
}