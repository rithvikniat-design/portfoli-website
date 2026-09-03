import Link from "next/link";
import { prisma } from "@/lib/prisma";
import WorkCard from "@/components/public/WorkCard";
import ScrollReveal from "@/components/public/ScrollReveal";
import { ArrowRight, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  const [settings, featuredWorks, inDevProjects, featuredNovels] =
    await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.work.findMany({
        where: { status: "published", deletedAt: null, featured: true },
        orderBy: { order: "asc" },
        take: 4,
      }),
      prisma.inDevProject.findMany({
        where: { status: "published", deletedAt: null },
        orderBy: { order: "asc" },
        take: 2,
      }),
      prisma.novel.findMany({
        where: { status: "published", deletedAt: null, featured: true },
        orderBy: { order: "asc" },
        take: 2,
      }),
    ]);

  return { settings, featuredWorks, inDevProjects, featuredNovels };
}

function getStatusBadgeClass(status: string) {
  const s = status.toLowerCase().replace(/[- ]/g, "");
  if (s === "concept") return "badge-concept";
  if (s === "treatment") return "badge-treatment";
  if (s.includes("pre")) return "badge-preproduction";
  if (s === "financing") return "badge-financing";
  return "badge-draft";
}

export default async function HomePage() {
  const { settings, featuredWorks, inDevProjects, featuredNovels } =
    await getData();

  return (
    <div className="page-enter">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-900/50 to-charcoal-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,168,78,0.06)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-6 animate-fade-in">
            <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-medium">
              {settings?.heroSubtitle || "Filmmaker · Novelist"}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 animate-fade-in-up leading-tight">
            {settings?.siteName || "Arjun Menon"}
          </h1>

          <p className="text-charcoal-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed"
             style={{ animationDelay: "0.2s" }}>
            {settings?.tagline ||
              "Exploring the human condition through cinema and literature."}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/works"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold-400 text-charcoal-950 font-medium rounded-lg hover:bg-gold-300 transition-colors"
            >
              View Works
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3 border border-charcoal-600 text-white rounded-lg hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              About Me
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-charcoal-500">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ── Featured Works ── */}
      {featuredWorks.length > 0 && (
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
                  Selected
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-white mt-2">
                  Featured Works
                </h2>
              </div>
              <Link
                href="/works"
                className="text-sm text-charcoal-400 hover:text-gold-400 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorks.map((work, i) => (
              <ScrollReveal key={work.id} delay={i * 100}>
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
        </section>
      )}

      {/* ── Gold Divider ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-divider" />
      </div>

      {/* ── In Development ── */}
      {inDevProjects.length > 0 && (
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
                  Coming Soon
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-white mt-2">
                  In Development
                </h2>
              </div>
              <Link
                href="/in-development"
                className="text-sm text-charcoal-400 hover:text-gold-400 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inDevProjects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 150}>
                <div className="group bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6 hover:border-gold-400/20 transition-all duration-500">
                  <div className="flex items-start gap-5">
                    {project.poster && (
                      <div className="w-24 h-36 rounded-lg overflow-hidden shrink-0 bg-charcoal-800">
                        <img
                          src={project.poster}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`badge ${getStatusBadgeClass(project.devStatus)} mb-3`}
                      >
                        {project.devStatus}
                      </span>
                      <h3 className="font-display text-xl text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.genre && (
                        <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-2">
                          {project.genre}
                        </p>
                      )}
                      {project.concept && (
                        <div
                          className="text-sm text-charcoal-300 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: project.concept }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Novels ── */}
      {featuredNovels.length > 0 && (
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="gold-divider mb-24" />
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
                  Literature
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-white mt-2">
                  Writing
                </h2>
              </div>
              <Link
                href="/writing"
                className="text-sm text-charcoal-400 hover:text-gold-400 transition-colors flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredNovels.map((novel, i) => (
              <ScrollReveal key={novel.id} delay={i * 150}>
                <Link href={`/writing/${novel.slug}`} className="group block">
                  <div className="flex gap-6 bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-6 hover:border-gold-400/20 transition-all duration-500">
                    {novel.coverImage && (
                      <div className="w-32 h-48 rounded-lg overflow-hidden shrink-0 bg-charcoal-800 shadow-lg">
                        <img
                          src={novel.coverImage}
                          alt={novel.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl text-white mb-2 group-hover:text-gold-400 transition-colors">
                        {novel.title}
                      </h3>
                      {novel.genre && (
                        <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-3">
                          {novel.genre}
                        </p>
                      )}
                      {novel.synopsis && (
                        <div
                          className="text-sm text-charcoal-300 line-clamp-4 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: novel.synopsis }}
                        />
                      )}
                      <span className="inline-flex items-center gap-1 mt-4 text-gold-400 text-sm">
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
