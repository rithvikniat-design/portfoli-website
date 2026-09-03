import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase.from("Work").select("*, images:WorkImage(*)").order("order", { ascending: true });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data } = await supabase.from("Work").insert([body]).select().single();
  return NextResponse.json(data, { status: 201 });
}