import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseJsonField, formatRuntime } from "@/lib/utils";
import ImageGallery from "@/components/public/ImageGallery";
import TrailerEmbed from "@/components/public/TrailerEmbed";
import ScrollReveal from "@/components/public/ScrollReveal";
import { Calendar, Clock, Film, Award, Download } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await prisma.work.findUnique({ where: { slug: params.slug } });
  if (!work) return { title: "Not Found" };
  return {
    title: work.title,
    description: work.logline || `${work.title} — directed by Arjun Menon`,
    openGraph: {
      title: work.title,
      description: work.logline || undefined,
      images: work.poster ? [{ url: work.poster }] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }: Props) {
  const work = await prisma.work.findUnique({
    where: { slug: params.slug, status: "published", deletedAt: null },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!work) notFound();

  const festivals = parseJsonField<string[]>(work.festivals, []);
  const credits = parseJsonField<{ role: string; name: string }[]>(
    work.credits,
    []
  );

  return (
    <div className="page-enter pt-24 pb-20">
      {/* Hero */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-10 lg:gap-16">
            {/* Poster */}
            <ScrollReveal>
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-charcoal-800 shadow-2xl border border-charcoal-700/50 mx-auto lg:mx-0 max-w-[300px] lg:max-w-none">
                {work.poster ? (
                  <img
                    src={work.poster}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal-600">
                    <Film size={48} />
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal delay={100}>
              <div>
                <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
                  {work.role}
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mt-3 mb-4">
                  {work.title}
                </h1>

                {work.logline && (
                  <p className="text-xl text-charcoal-300 italic mb-8 leading-relaxed">
                    &ldquo;{work.logline}&rdquo;
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap gap-6 mb-8 text-sm text-charcoal-400">
                  {work.year && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gold-400" />
                      {work.year}
                    </div>
                  )}
                  {work.runtime && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gold-400" />
                      {formatRuntime(work.runtime)}
                    </div>
                  )}
                  {work.genre && (
                    <div className="flex items-center gap-2">
                      <Film size={16} className="text-gold-400" />
                      {work.genre}
                    </div>
                  )}
                </div>

                {/* Festivals/Laurels */}
                {festivals.length > 0 && (
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-3">
                      {festivals.map((festival, i) => (
                        <div key={i} className="laurel">
                          <Award size={14} />
                          {festival}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {work.tags && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {work.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-charcoal-800 text-charcoal-300 border border-charcoal-700"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {work.pdfUrl && (
                  <a
                    href={work.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-800 border border-charcoal-700 rounded-lg text-sm text-charcoal-300 hover:text-gold-400 hover:border-gold-400/30 transition-colors"
                  >
                    <Download size={16} />
                    Download Treatment / Lookbook
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-divider my-12" />

        {/* Description */}
        {work.description && (
          <ScrollReveal>
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl text-white mb-6">About</h2>
              <div
                className="prose-dark"
                dangerouslySetInnerHTML={{ __html: work.description }}
              />
            </div>
          </ScrollReveal>
        )}

        {/* Trailer */}
        {work.trailerUrl && (
          <ScrollReveal className="mt-16">
            <h2 className="font-display text-2xl text-white mb-6">Trailer</h2>
            <TrailerEmbed url={work.trailerUrl} title={`${work.title} Trailer`} />
          </ScrollReveal>
        )}

        {/* Stills Gallery */}
        {work.images.length > 0 && (
          <ScrollReveal className="mt-16">
            <h2 className="font-display text-2xl text-white mb-6">Stills</h2>
            <ImageGallery
              images={work.images.map((img) => ({
                url: img.url,
                alt: img.alt,
              }))}
            />
          </ScrollReveal>
        )}

        {/* Credits */}
        {credits.length > 0 && (
          <ScrollReveal className="mt-16">
            <h2 className="font-display text-2xl text-white mb-6">Credits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {credits.map((credit, i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-charcoal-800/50"
                >
                  <span className="text-sm text-charcoal-400">
                    {credit.role}
                  </span>
                  <span className="text-sm text-white">{credit.name}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
