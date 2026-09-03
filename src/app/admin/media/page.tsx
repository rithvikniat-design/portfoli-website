"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Media {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMedia = async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { loadMedia(); }, []);

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return;
    const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); loadMedia(); }
    else toast.error("Failed to delete");
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">Media Library</h1>
          <p className="text-charcoal-400 text-sm mt-1">{media.length} items</p>
        </div>
      </div>

      <div className="mb-8 admin-card">
        <h2 className="text-sm font-medium text-white mb-4">Upload New File</h2>
        <ImageUpload value={null} onChange={(url) => { if (url) { toast.success("Uploaded"); loadMedia(); } }} label="" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-charcoal-800 rounded-lg animate-pulse" />)}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative bg-charcoal-900 border border-charcoal-800 rounded-lg overflow-hidden">
              <div className="aspect-square bg-charcoal-800 p-2 flex items-center justify-center">
                <img src={item.url} alt={item.filename} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
              <div className="p-2 border-t border-charcoal-800">
                <p className="text-xs text-charcoal-300 truncate" title={item.filename}>{item.filename}</p>
                <p className="text-[10px] text-charcoal-500">{(item.size / 1024).toFixed(1)} KB</p>
              </div>
              <div className="absolute inset-0 bg-charcoal-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(item.url)} className="p-2 bg-charcoal-800 text-white rounded hover:text-gold-400" title="Copy URL"><Copy size={14} /></button>
                <a href={item.url} target="_blank" className="p-2 bg-charcoal-800 text-white rounded hover:text-gold-400" title="Open"><ExternalLink size={14} /></a>
                <button onClick={() => handleDelete(item.id, item.filename)} className="p-2 bg-charcoal-800 text-white rounded hover:text-red-400" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 admin-card">
          <p className="text-charcoal-400">No media uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
