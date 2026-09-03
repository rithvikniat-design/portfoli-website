import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase.from("About").select("*").limit(1).single();
  return NextResponse.json(data || {});
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  
  const { data: existing } = await supabase.from("About").select("id").limit(1).maybeSingle();

  let result;
  if (existing) {
    const { data } = await supabase.from("About").update(body).eq("id", existing.id).select().single();
    result = data;
  } else {
    const { data } = await supabase.from("About").insert([body]).select().single();
    result = data;
  }

  return NextResponse.json(result);
}