import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static routes
  const routes = ["", "/works", "/in-development", "/writing", "/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Works
  const works = await prisma.work.findMany({ where: { status: "published", deletedAt: null } });
  const workRoutes = works.map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: work.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Novels
  const novels = await prisma.novel.findMany({ where: { status: "published", deletedAt: null } });
  const novelRoutes = novels.map((novel) => ({
    url: `${baseUrl}/writing/${novel.slug}`,
    lastModified: novel.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...workRoutes, ...novelRoutes];
}
