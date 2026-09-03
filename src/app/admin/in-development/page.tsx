"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  id: string;
  title: string;
  devStatus: string;
  status: string;
  featured: boolean;
  poster: string | null;
  slug: string;
}

export default function AdminInDevPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/in-development");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/in-development/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); }
    else toast.error("Failed");
  };

  if (loading) return <div className="animate-pulse"><div className="h-8 bg-charcoal-800 rounded w-48 mb-6" />{[1,2].map(i => <div key={i} className="h-20 bg-charcoal-800 rounded-xl mb-3" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">In Development</h1>
          <p className="text-charcoal-400 text-sm mt-1">{projects.length} projects</p>
        </div>
        <Link href="/admin/in-development/new" className="admin-btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="admin-card flex items-center gap-4 !p-4">
              <div className="w-12 h-16 rounded bg-charcoal-700 overflow-hidden shrink-0">
                {p.poster ? <img src={p.poster} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-charcoal-500 text-xs">—</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{p.title}</h3>
                <p className="text-xs text-charcoal-400 mt-0.5">{p.devStatus}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border ${p.status === "published" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-charcoal-700/50 text-charcoal-400 border-charcoal-600"}`}>{p.status}</span>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/in-development/${p.id}/edit`} className="p-2 rounded-lg text-charcoal-500 hover:text-white hover:bg-charcoal-700 transition-colors"><Edit size={16} /></Link>
                <button onClick={() => handleDelete(p.id, p.title)} className="p-2 rounded-lg text-charcoal-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card text-center py-16">
          <p className="text-charcoal-400 mb-4">No projects yet</p>
          <Link href="/admin/in-development/new" className="admin-btn-primary inline-flex items-center gap-2"><Plus size={18} /> Add project</Link>
        </div>
      )}
    </div>
  );
}
