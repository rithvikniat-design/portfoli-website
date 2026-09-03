import { prisma } from "@/lib/prisma";
import WorkCard from "@/components/public/WorkCard";
import ScrollReveal from "@/components/public/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Works",
  description: "Complete filmography — films, shorts, and projects.",
};

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div className="page-enter pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
          Filmography
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">
          Works
        </h1>
        <p className="text-charcoal-400 max-w-xl">
          A collection of completed films, shorts, and projects.
        </p>
        <div className="gold-divider mt-8" />
      </div>

      {works.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {works.map((work, i) => (
            <ScrollReveal key={work.id} delay={i * 80}>
              <WorkCard
                slug={work.slug}
                title={work.title}
                year={work.year}
                role={work.role}
                genre={work.genre}
                poster={work.poster}
                logline={work.logline}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-charcoal-500">
          <p className="text-lg">No works published yet.</p>
        </div>
      )}
    </div>
  );
}
