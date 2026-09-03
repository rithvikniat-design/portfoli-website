import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export const metadata = { title: "Writing & Novels | Director Portfolio" };

export default async function WritingPage() {
  const { data: novels } = await supabase.from("Novel").select("*").eq("status", "published").order("order", { ascending: true });

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-light mb-16 tracking-wide">Writing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {novels?.map((novel) => (
          <Link key={novel.id} href={`/writing/${novel.slug}`} className="group flex flex-col gap-6">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 transition-all duration-500 group-hover:border-gold/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              {novel.coverImage ? (
                <Image src={novel.coverImage} alt={novel.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={32} className="text-zinc-800" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-light mb-2 group-hover:text-gold transition-colors">{novel.title}</h3>
              <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-zinc-500">
                <span>{novel.pubStatus}</span>
                {novel.genre && <span>• {novel.genre}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}