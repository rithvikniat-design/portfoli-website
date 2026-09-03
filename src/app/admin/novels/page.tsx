"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNovelsPage() {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/novels");
    setNovels(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/novels/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); } else toast.error("Failed");
  };

  if (loading) return <div className="animate-pulse"><div className="h-8 bg-charcoal-800 rounded w-32 mb-6" />{[1,2].map(i=><div key={i} className="h-20 bg-charcoal-800 rounded-xl mb-3" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">Novels</h1>
          <p className="text-charcoal-400 text-sm mt-1">{novels.length} novels</p>
        </div>
        <Link href="/admin/novels/new" className="admin-btn-primary flex items-center gap-2"><Plus size={18} /> Add Novel</Link>
      </div>
      {novels.length > 0 ? (
        <div className="space-y-3">
          {novels.map((n: any) => (
            <div key={n.id} className="admin-card flex items-center gap-4 !p-4">
              <div className="w-10 h-14 rounded bg-charcoal-700 overflow-hidden shrink-0">
                {n.coverImage ? <img src={n.coverImage} alt={n.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-charcoal-500 text-[10px]">—</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{n.title}</h3>
                <p className="text-xs text-charcoal-400">{n.genre} · {n.pubStatus}</p>
              </div>
              <span className={`text-[10px] uppercase px-3 py-1 rounded-full border ${n.status === "published" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-charcoal-700/50 text-charcoal-400 border-charcoal-600"}`}>{n.status}</span>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/novels/${n.id}/edit`} className="p-2 rounded-lg text-charcoal-500 hover:text-white hover:bg-charcoal-700"><Edit size={16} /></Link>
                <button onClick={() => handleDelete(n.id, n.title)} className="p-2 rounded-lg text-charcoal-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card text-center py-16">
          <p className="text-charcoal-400 mb-4">No novels yet</p>
          <Link href="/admin/novels/new" className="admin-btn-primary inline-flex items-center gap-2"><Plus size={18} /> Add novel</Link>
        </div>
      )}
    </div>
  );
}
