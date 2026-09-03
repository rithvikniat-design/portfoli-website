import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/utils";
import ScrollReveal from "@/components/public/ScrollReveal";
import { Award, Quote, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Biography, awards, press, and collaborators.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await prisma.about.findFirst();

  const awards = parseJsonField<{ title: string; year?: string; detail?: string }[]>(
    about?.awards,
    []
  );
  const press = parseJsonField<{ title: string; outlet?: string; url?: string }[]>(
    about?.press,
    []
  );
  const collaborators = parseJsonField<{ name: string; role?: string; image?: string }[]>(
    about?.collaborators,
    []
  );

  return (
    <div className="page-enter pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="text-gold-400 text-xs uppercase tracking-[0.3em]">
          Biography
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">
          About
        </h1>
        <div className="gold-divider mt-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
        {/* Main Content */}
        <div>
          {/* Portrait + Bio */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-8 mb-16">
              {about?.portrait && (
                <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-charcoal-800 shadow-2xl border border-charcoal-700/50">
                    <img
                      src={about.portrait}
                      alt="Director portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {about?.bio && (
                <div
                  className="prose-dark flex-1"
                  dangerouslySetInnerHTML={{ __html: about.bio }}
                />
              )}
            </div>
          </ScrollReveal>

          {/* Press */}
          {press.length > 0 && (
            <ScrollReveal className="mb-16">
              <h2 className="font-display text-2xl text-white mb-6 flex items-center gap-3">
                <Quote size={20} className="text-gold-400" />
                Press
              </h2>
              <div className="space-y-4">
                {press.map((item, i) => (
                  <div
                    key={i}
                    className="bg-charcoal-900/50 border border-charcoal-800 rounded-lg p-5"
                  >
                    <p className="text-white font-medium mb-1">{item.title}</p>
                    {item.outlet && (
                      <p className="text-sm text-charcoal-400">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-400 hover:text-gold-300 transition-colors"
                          >
                            {item.outlet} ↗
                          </a>
                        ) : (
                          item.outlet
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Awards */}
          {awards.length > 0 && (
            <ScrollReveal className="mb-12">
              <h2 className="font-display text-xl text-white mb-6 flex items-center gap-3">
                <Award size={18} className="text-gold-400" />
                Awards & Festivals
              </h2>
              <div className="space-y-3">
                {awards.map((award, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-gold-400/30 pl-4 py-1"
                  >
                    <p className="text-sm text-white font-medium">
                      {award.title}
                    </p>
                    <p className="text-xs text-charcoal-400">
                      {award.detail}
                      {award.year && ` · ${award.year}`}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <ScrollReveal>
              <h2 className="font-display text-xl text-white mb-6 flex items-center gap-3">
                <Users size={18} className="text-gold-400" />
                Key Collaborators
              </h2>
              <div className="space-y-4">
                {collaborators.map((collab, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {collab.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-charcoal-800">
                        <img
                          src={collab.image}
                          alt={collab.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-charcoal-500 text-sm font-medium">
                        {collab.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white">{collab.name}</p>
                      {collab.role && (
                        <p className="text-xs text-charcoal-400">
                          {collab.role}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
