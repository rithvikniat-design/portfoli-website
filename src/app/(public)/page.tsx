import Link from "next/link";
import { supabase } from "@/lib/supabase";
import WorkCard from "@/components/public/WorkCard";
import ScrollReveal from "@/components/public/ScrollReveal";
import { ArrowRight, ChevronDown } from "lucide-react";

export default async function Home() {
  const { data: settings } = await supabase.from("SiteSettings").select("*").limit(1).single();
  const { data: featuredWorks } = await supabase.from("Work").select("*").eq("status", "published").eq("featured", true).order("order", { ascending: true }).limit(4);
  const { data: inDev } = await supabase.from("InDevProject").select("*").eq("status", "published").eq("featured", true).order("order", { ascending: true }).limit(2);

  return (
    <div className="flex flex-col">
      <section className="h-screen relative flex items-center justify-center px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black z-10 pointer-events-none" />
        
        <div className="z-20 text-center max-w-4xl mx-auto mt-20">
          <ScrollReveal>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight">
              {settings?.siteName || "Director Name"}
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-400 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
              {settings?.heroSubtitle || "Filmmaker & Author"}
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <div className="h-[1px] w-24 bg-gold mx-auto mb-8" />
            <p className="text-sm uppercase tracking-[0.3em] font-mono text-zinc-500">
              {settings?.tagline || "Crafting Cinematic Stories"}
            </p>
          </ScrollReveal>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="text-zinc-600" size={24} />
        </div>
      </section>

      {featuredWorks && featuredWorks.length > 0 && (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-3xl font-light">Featured Works</h2>
              <Link href="/works" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-mono text-gold hover:text-white transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {featuredWorks.map((work, idx) => (
              <ScrollReveal key={work.id} delay={idx * 0.1}>
                <WorkCard work={work} />
              </ScrollReveal>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/works" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-mono text-gold hover:text-white transition-colors">
                View All Works <ArrowRight size={16} />
              </Link>
          </div>
        </section>
      )}

      {inDev && inDev.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-zinc-950 w-full border-y border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl font-light mb-16 text-center">In Development</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {inDev.map((project, idx) => (
                <ScrollReveal key={project.id} delay={idx * 0.1}>
                  <Link href="/in-development" className="block group p-8 border border-zinc-800 bg-black hover:border-gold/50 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-light group-hover:text-gold transition-colors">{project.title}</h3>
                      <span className="text-xs uppercase tracking-widest font-mono text-zinc-500 bg-zinc-900 px-3 py-1">{project.devStatus}</span>
                    </div>
                    {project.concept && (
                      <div className="prose prose-invert prose-sm prose-zinc line-clamp-3 prose-p:text-zinc-400" dangerouslySetInnerHTML={{ __html: project.concept }} />
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}