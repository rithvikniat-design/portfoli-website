import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: novel } = await supabase.from("Novel").select("*").eq("slug", params.slug).single();
  if (!novel) return { title: "Not Found" };
  return { title: `${novel.title} | Writing` };
}

export default async function NovelDetail({ params }: { params: { slug: string } }) {
  const { data: novel } = await supabase.from("Novel").select("*").eq("slug", params.slug).single();
  if (!novel) notFound();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Link href="/writing" className="inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition-colors mb-12 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Writing
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            {novel.coverImage ? (
              <Image src={novel.coverImage} alt={novel.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                <BookOpen size={48} className="text-zinc-800" />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">{novel.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 font-mono tracking-wider">
              {novel.genre && <span>{novel.genre}</span>}
              {novel.genre && <span>•</span>}
              <span>{novel.pubStatus}</span>
              {novel.publisher && <span>•</span>}
              {novel.publisher && <span>{novel.publisher}</span>}
            </div>
          </div>

          {novel.buyLink && (
            <a
              href={novel.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black hover:bg-white transition-colors uppercase tracking-widest text-sm font-medium w-fit mb-12"
            >
              Order Now <ExternalLink size={16} />
            </a>
          )}

          {novel.synopsis && (
            <div className="mb-12">
              <h2 className="text-sm text-gold font-mono uppercase tracking-widest mb-6">Synopsis</h2>
              <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed prose-p:text-zinc-300" dangerouslySetInnerHTML={{ __html: novel.synopsis }} />
            </div>
          )}

          {novel.excerpt && (
            <div className="p-8 md:p-12 border border-zinc-800 bg-black relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">Excerpt</div>
              <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-relaxed prose-p:text-zinc-400 font-serif italic" dangerouslySetInnerHTML={{ __html: novel.excerpt }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}