import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TrailerEmbed from "@/components/public/TrailerEmbed";
import ImageGallery from "@/components/public/ImageGallery";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: work } = await supabase.from("Work").select("title").eq("slug", params.slug).single();
  if (!work) return { title: "Not Found" };
  return { title: `${work.title} | Selected Works` };
}

export default async function WorkDetail({ params }: { params: { slug: string } }) {
  const { data: work } = await supabase.from("Work").select("*, images:WorkImage(*)").eq("slug", params.slug).single();
  if (!work) notFound();

  return (
    <div className="pt-24 pb-24">
      {work.trailerUrl && (
        <div className="w-full aspect-video max-h-[80vh] bg-black mb-12 lg:mb-24 relative">
          <TrailerEmbed url={work.trailerUrl} />
        </div>
      )}

      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {!work.trailerUrl && (
          <Link href="/works" className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition-colors mb-12 mt-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Works
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-6">{work.title}</h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-12">
              {work.logline}
            </p>
            
            {work.description && (
              <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-loose prose-p:text-zinc-300" dangerouslySetInnerHTML={{ __html: work.description }} />
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-6 p-8 border border-zinc-800 bg-zinc-950">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Role</span>
                <span className="text-sm font-medium">{work.role}</span>
              </div>
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Year</span>
                <span className="text-sm font-medium">{work.year || "—"}</span>
              </div>
              {work.runtime && (
                <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Runtime</span>
                  <span className="text-sm font-medium">{work.runtime}</span>
                </div>
              )}
              {work.genre && (
                <div className="flex justify-between items-end pb-4">
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Genre</span>
                  <span className="text-sm font-medium">{work.genre}</span>
                </div>
              )}
            </div>

            {work.festivals && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold font-mono mb-4">Festivals & Awards</h3>
                <div className="prose prose-invert prose-sm prose-p:text-zinc-400" dangerouslySetInnerHTML={{ __html: work.festivals }} />
              </div>
            )}
            
            {work.credits && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold font-mono mb-4">Selected Credits</h3>
                <div className="prose prose-invert prose-sm prose-p:text-zinc-400" dangerouslySetInnerHTML={{ __html: work.credits }} />
              </div>
            )}
          </div>
        </div>

        {work.images && work.images.length > 0 && (
          <div className="mt-32">
            <ImageGallery images={work.images} />
          </div>
        )}
      </div>
    </div>
  );
}