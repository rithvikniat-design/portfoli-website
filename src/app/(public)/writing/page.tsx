import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/public/ScrollReveal";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Novels, books, and written works.",
};

export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const novels = await prisma.novel.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div className="page-enter pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
          Literature
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">
          Writing
        </h1>
        <p className="text-charcoal-400 max-w-xl">
          Novels, short stories, and written works.
        </p>
        <div className="gold-divider mt-8" />
      </div>

      {novels.length > 0 ? (
        <div className="space-y-10">
          {novels.map((novel, i) => (
            <ScrollReveal key={novel.id} delay={i * 100}>
              <Link href={`/writing/${novel.slug}`} className="group block">
                <div className="flex flex-col sm:flex-row gap-8 bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6 lg:p-8 hover:border-gold-400/20 transition-all duration-500">
                  {/* Cover */}
                  <div className="w-40 sm:w-48 shrink-0 mx-auto sm:mx-0">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-charcoal-800 shadow-2xl">
                      {novel.coverImage ? (
                        <img
                          src={novel.coverImage}
                          alt={novel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal-600">
                          <BookOpen size={40} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {novel.pubStatus && (
                        <span className="badge badge-published">
                          {novel.pubStatus}
                        </span>
                      )}
                      {novel.genre && (
                        <span className="text-xs text-charcoal-400 uppercase tracking-wider">
                          {novel.genre}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-2xl lg:text-3xl text-white mb-3 group-hover:text-gold-400 transition-colors">
                      {novel.title}
                    </h2>

                    {(novel.publisher || novel.isbn) && (
                      <p className="text-sm text-charcoal-500 mb-3">
                        {novel.publisher}
                        {novel.publisher && novel.isbn && " · "}
                        {novel.isbn && `ISBN: ${novel.isbn}`}
                      </p>
                    )}

                    {novel.synopsis && (
                      <div
                        className="prose-dark text-sm line-clamp-4"
                        dangerouslySetInnerHTML={{ __html: novel.synopsis }}
                      />
                    )}

                    <span className="inline-flex items-center gap-1 mt-4 text-gold-400 text-sm group-hover:gap-2 transition-all">
                      Read more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-charcoal-500">
          <p className="text-lg">No written works published yet.</p>
        </div>
      )}
    </div>
  );
}
