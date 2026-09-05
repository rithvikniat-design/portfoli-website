import { supabase } from "@/lib/supabase";
import ScrollReveal from "@/components/public/ScrollReveal";

export const metadata = { title: "In Development | Ayalapu Rithvik Reddy" };

export default async function InDevelopmentPage() {
  const { data: projects } = await supabase.from("InDevProject").select("*").eq("status", "published").order("order", { ascending: true });

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
      <ScrollReveal>
        <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-wide">In Development</h1>
        <p className="text-xl text-zinc-400 font-light mb-16">Projects currently seeking funding, packaging, or in active pre-production.</p>
      </ScrollReveal>
      
      <div className="flex flex-col gap-12 lg:gap-24">
        {projects?.map((project, index) => (
          <ScrollReveal key={project.id} delay={0.1}>
            <div className="border border-zinc-800 bg-zinc-950 p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" />
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-light mb-2">{project.title}</h2>
                  <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-zinc-500">
                    <span>{project.genre}</span>
                  </div>
                </div>
                <div className="inline-flex items-center px-4 py-2 border border-zinc-800 bg-black text-xs uppercase tracking-widest font-mono text-gold">
                  Status: {project.devStatus}
                </div>
              </div>

              {project.concept && (
                <div className="mb-8">
                  <h3 className="text-sm text-gold font-mono uppercase tracking-widest mb-4">Concept</h3>
                  <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed prose-p:text-zinc-300" dangerouslySetInnerHTML={{ __html: project.concept }} />
                </div>
              )}
              
              {project.treatment && (
                <div className="pt-8 border-t border-zinc-900">
                  <h3 className="text-sm text-zinc-500 font-mono uppercase tracking-widest mb-4">Director's Treatment</h3>
                  <div className="prose prose-invert prose-zinc max-w-none prose-sm prose-p:leading-relaxed prose-p:text-zinc-400 font-serif italic" dangerouslySetInnerHTML={{ __html: project.treatment }} />
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}