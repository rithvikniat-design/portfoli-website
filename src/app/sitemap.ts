import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/works",
    "/in-development",
    "/writing",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const { data: works } = await supabase.from("Work").select("slug, updatedAt").eq("status", "published").is("deletedAt", null);
  
  const workRoutes = (works || []).map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: new Date(work.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const { data: novels } = await supabase.from("Novel").select("slug, updatedAt").eq("status", "published").is("deletedAt", null);
  
  const novelRoutes = (novels || []).map((novel) => ({
    url: `${baseUrl}/writing/${novel.slug}`,
    lastModified: new Date(novel.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...novelRoutes];
}
