import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/public/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "In Development",
  description: "Upcoming films and projects currently in development.",
};

export const dynamic = "force-dynamic";

function getStatusBadgeClass(status: string) {
  const s = status.toLowerCase().replace(/[- ]/g, "");
  if (s === "concept") return "badge-concept";
  if (s === "treatment") return "badge-treatment";
  if (s.includes("pre")) return "badge-preproduction";
  if (s === "financing") return "badge-financing";
  return "badge-draft";
}

export default async function InDevelopmentPage() {
  const projects = await prisma.inDevProject.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div className="page-enter pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
          Coming Soon
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">
          In Development
        </h1>
        <p className="text-charcoal-400 max-w-xl">
          Projects currently in various stages of development.
        </p>
        <div className="gold-divider mt-8" />
      </div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 100}>
              <div className="group bg-charcoal-900/50 border border-charcoal-800 rounded-xl overflow-hidden hover:border-gold-400/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row">
                  {/* Poster */}
                  {project.poster && (
                    <div className="md:w-48 lg:w-56 shrink-0">
                      <div className="aspect-[2/3] md:aspect-auto md:h-full">
                        <img
                          src={project.poster}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`badge ${getStatusBadgeClass(project.devStatus)}`}
                      >
                        {project.devStatus}
                      </span>
                      {project.genre && (
                        <span className="text-xs text-charcoal-400 uppercase tracking-wider">
                          {project.genre}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-2xl lg:text-3xl text-white mb-4 group-hover:text-gold-400 transition-colors">
                      {project.title}
                    </h2>

                    {project.concept && (
                      <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-widest text-gold-400 mb-2">
                          Concept
                        </h3>
                        <div
                          className="prose-dark text-sm"
                          dangerouslySetInnerHTML={{ __html: project.concept }}
                        />
                      </div>
                    )}

                    {project.treatment && (
                      <details className="group/details">
                        <summary className="text-xs uppercase tracking-widest text-gold-400 cursor-pointer hover:text-gold-300 transition-colors mb-2 list-none flex items-center gap-1">
                          <span>Treatment</span>
                          <svg
                            className="w-3 h-3 transition-transform group-open/details:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <div
                          className="prose-dark text-sm mt-2"
                          dangerouslySetInnerHTML={{ __html: project.treatment }}
                        />
                      </details>
                    )}

                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-charcoal-800 text-charcoal-400 border border-charcoal-700"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-charcoal-500">
          <p className="text-lg">No projects in development at this time.</p>
        </div>
      )}
    </div>
  );
}
