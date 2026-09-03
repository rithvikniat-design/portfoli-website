import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/public/ScrollReveal";
import { BookOpen, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const novel = await prisma.novel.findUnique({ where: { slug: params.slug } });
  if (!novel) return { title: "Not Found" };
  return {
    title: novel.title,
    description: novel.synopsis
      ? novel.synopsis.replace(/<[^>]*>/g, "").substring(0, 160)
      : `${novel.title} by Arjun Menon`,
    openGraph: {
      title: novel.title,
      images: novel.coverImage ? [{ url: novel.coverImage }] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function NovelDetailPage({ params }: Props) {
  const novel = await prisma.novel.findUnique({
    where: { slug: params.slug, status: "published", deletedAt: null },
  });

  if (!novel) notFound();

  return (
    <div className="page-enter pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
        {/* Cover */}
        <ScrollReveal>
          <div className="mx-auto lg:mx-0 w-64 lg:w-full">
            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-charcoal-800 shadow-2xl border border-charcoal-700/50">
              {novel.coverImage ? (
                <img
                  src={novel.coverImage}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal-600">
                  <BookOpen size={48} />
                </div>
              )}
            </div>

            {/* Buy Link */}
            {novel.buyLink && (
              <a
                href={novel.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-400 text-charcoal-950 font-medium rounded-lg hover:bg-gold-300 transition-colors"
              >
                Purchase <ExternalLink size={16} />
              </a>
            )}
          </div>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={100}>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {novel.pubStatus && (
                <span className="badge badge-published">{novel.pubStatus}</span>
              )}
              {novel.genre && (
                <span className="text-xs text-charcoal-400 uppercase tracking-wider">
                  {novel.genre}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-white mb-6">
              {novel.title}
            </h1>

            {(novel.publisher || novel.isbn) && (
              <p className="text-charcoal-400 mb-8">
                {novel.publisher}
                {novel.publisher && novel.isbn && " · "}
                {novel.isbn && `ISBN: ${novel.isbn}`}
              </p>
            )}

            {/* Synopsis */}
            {novel.synopsis && (
              <div className="mb-12">
                <h2 className="font-display text-xl text-white mb-4">
                  Synopsis
                </h2>
                <div
                  className="prose-dark"
                  dangerouslySetInnerHTML={{ __html: novel.synopsis }}
                />
              </div>
            )}

            <div className="gold-divider my-10" />

            {/* Excerpt */}
            {novel.excerpt && (
              <div>
                <h2 className="font-display text-xl text-white mb-4">
                  Excerpt
                </h2>
                <div className="bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6 lg:p-8">
                  <div
                    className="prose-dark italic"
                    dangerouslySetInnerHTML={{ __html: novel.excerpt }}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
