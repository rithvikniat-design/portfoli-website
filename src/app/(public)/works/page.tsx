import { supabase } from "@/lib/supabase";
import WorkCard from "@/components/public/WorkCard";
import ScrollReveal from "@/components/public/ScrollReveal";

export const metadata = { title: "Selected Works | Director Portfolio" };

export default async function WorksPage() {
  const { data: works } = await supabase.from("Work").select("*").eq("status", "published").order("order", { ascending: true });

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <ScrollReveal>
        <h1 className="text-4xl md:text-5xl font-light mb-16 tracking-wide">Selected Works</h1>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {works?.map((work, index) => (
          <ScrollReveal key={work.id} delay={index * 0.1}>
            <WorkCard work={work} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}