import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: settings } = await supabase.from("SiteSettings").select("*").limit(1).single();
  return NextResponse.json(settings || {});
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data: existingSettings } = await supabase.from("SiteSettings").select("id").limit(1).maybeSingle();

  const settingsData = {
    siteName: body.siteName || "Director Portfolio",
    tagline: body.tagline || "",
    heroSubtitle: body.heroSubtitle || "",
    contactEmail: body.contactEmail || "",
    socialLinks: body.socialLinks || null,
    updatedAt: new Date().toISOString()
  };

  let result;
  if (existingSettings) {
    const { data } = await supabase
      .from("SiteSettings")
      .update(settingsData)
      .eq("id", existingSettings.id)
      .select()
      .single();
    result = data;
  } else {
    const { data } = await supabase
      .from("SiteSettings")
      .insert([settingsData])
      .select()
      .single();
    result = data;
  }

  return NextResponse.json(result);
}
