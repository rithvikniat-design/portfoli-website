import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ScrollReveal from "@/components/public/ScrollReveal";

export const metadata = { title: "About | Director Portfolio" };

export default async function AboutPage() {
  const { data: about } = await supabase.from("About").select("*").limit(1).single();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {about?.portrait && (
          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="aspect-[3/4] relative border border-zinc-800 p-2">
                <div className="relative w-full h-full overflow-hidden filter grayscale hover:grayscale-0 transition-all duration-700">
                  <Image src={about.portrait} alt="Portrait" fill className="object-cover" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        <div className={`${about?.portrait ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl mx-auto'}`}>
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-light mb-12 tracking-wide">About</h1>
            
            {about?.bio && (
              <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-loose prose-p:text-zinc-300 prose-p:text-lg mb-16 font-light" dangerouslySetInnerHTML={{ __html: about.bio }} />
            )}
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {about?.awards && (
              <ScrollReveal delay={0.2}>
                <h3 className="text-sm uppercase tracking-widest text-gold font-mono mb-6">Awards & Honors</h3>
                <div className="prose prose-invert prose-sm prose-p:text-zinc-400" dangerouslySetInnerHTML={{ __html: about.awards }} />
              </ScrollReveal>
            )}

            {about?.press && (
              <ScrollReveal delay={0.3}>
                <h3 className="text-sm uppercase tracking-widest text-gold font-mono mb-6">Selected Press</h3>
                <div className="prose prose-invert prose-sm prose-p:text-zinc-400" dangerouslySetInnerHTML={{ __html: about.press }} />
              </ScrollReveal>
            )}
            
            {about?.collaborators && (
              <ScrollReveal delay={0.4} className="md:col-span-2">
                <h3 className="text-sm uppercase tracking-widest text-gold font-mono mb-6 border-t border-zinc-800 pt-8 mt-4">Selected Collaborators</h3>
                <div className="prose prose-invert prose-sm prose-p:text-zinc-400" dangerouslySetInnerHTML={{ __html: about.collaborators }} />
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}