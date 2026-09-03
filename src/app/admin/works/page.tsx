"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Star, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

interface Work {
  id: string;
  title: string;
  year: number | null;
  role: string;
  status: string;
  featured: boolean;
  poster: string | null;
  slug: string;
  order: number;
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorks = async () => {
    const res = await fetch("/api/works");
    const data = await res.json();
    setWorks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can be restored later.`)) return;

    const res = await fetch(`/api/works/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(`"${title}" deleted`);
      loadWorks();
    } else {
      toast.error("Failed to delete");
    }
  };

  const toggleFeatured = async (work: Work) => {
    const res = await fetch(`/api/works/${work.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...work, featured: !work.featured }),
    });
    if (res.ok) {
      toast.success(
        work.featured ? "Removed from featured" : "Added to featured"
      );
      loadWorks();
    }
  };

  const toggleStatus = async (work: Work) => {
    const newStatus = work.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/works/${work.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...work, status: newStatus }),
    });
    if (res.ok) {
      toast.success(`Status changed to ${newStatus}`);
      loadWorks();
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-charcoal-800 rounded w-32" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-charcoal-800 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">Works</h1>
          <p className="text-charcoal-400 text-sm mt-1">
            {works.length} {works.length === 1 ? "work" : "works"}
          </p>
        </div>
        <Link href="/admin/works/new" className="admin-btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Work
        </Link>
      </div>

      {works.length > 0 ? (
        <div className="space-y-3">
          {works.map((work) => (
            <div
              key={work.id}
              className="admin-card flex items-center gap-4 !p-4 hover:border-charcoal-600 transition-colors"
            >
              <GripVertical
                size={18}
                className="text-charcoal-600 cursor-grab shrink-0"
              />

              {/* Thumbnail */}
              <div className="w-12 h-16 rounded bg-charcoal-700 overflow-hidden shrink-0">
                {work.poster ? (
                  <img
                    src={work.poster}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal-500 text-xs">
                    —
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium truncate">
                    {work.title}
                  </h3>
                  {work.featured && (
                    <Star
                      size={14}
                      className="text-gold-400 fill-gold-400 shrink-0"
                    />
                  )}
                </div>
                <p className="text-xs text-charcoal-400 mt-0.5">
                  {work.year && `${work.year} · `}
                  {work.role}
                </p>
              </div>

              {/* Status */}
              <button
                onClick={() => toggleStatus(work)}
                className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border shrink-0 transition-colors ${
                  work.status === "published"
                    ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                    : "bg-charcoal-700/50 text-charcoal-400 border-charcoal-600 hover:bg-charcoal-700"
                }`}
              >
                {work.status}
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleFeatured(work)}
                  className={`p-2 rounded-lg transition-colors ${
                    work.featured
                      ? "text-gold-400 hover:bg-gold-400/10"
                      : "text-charcoal-500 hover:text-gold-400 hover:bg-charcoal-700"
                  }`}
                  title={work.featured ? "Unfeature" : "Feature"}
                >
                  <Star size={16} />
                </button>
                <Link
                  href={`/works/${work.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-charcoal-500 hover:text-white hover:bg-charcoal-700 transition-colors"
                  title="View live"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/admin/works/${work.id}/edit`}
                  className="p-2 rounded-lg text-charcoal-500 hover:text-white hover:bg-charcoal-700 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(work.id, work.title)}
                  className="p-2 rounded-lg text-charcoal-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card text-center py-16">
          <p className="text-charcoal-400 mb-4">No works yet</p>
          <Link
            href="/admin/works/new"
            className="admin-btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create your first work
          </Link>
        </div>
      )}
    </div>
  );
}
