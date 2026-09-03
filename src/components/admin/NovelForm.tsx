"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { generateSlug } from "@/lib/utils";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface NovelFormProps { initialData?: any; isEdit?: boolean; }

export default function NovelForm({ initialData, isEdit }: NovelFormProps) {
  const [form, setForm] = useState(initialData || {
    title: "", slug: "", coverImage: null, genre: "", pubStatus: "Forthcoming",
    synopsis: "", excerpt: "", buyLink: "", isbn: "", publisher: "",
    featured: false, status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev, [field]: value,
      ...(field === "title" && !isEdit ? { slug: generateSlug(value) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const url = isEdit ? `/api/novels/${form.id}` : "/api/novels";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Updated!" : "Created!");
      router.push("/admin/novels");
      router.refresh();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/novels" className="p-2 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-display text-white">{isEdit ? "Edit Novel" : "New Novel"}</h1>
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <div className="admin-card space-y-5">
            <div>
              <label className="admin-label">Title *</label>
              <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="admin-input" required placeholder="Novel title" />
            </div>
            <div>
              <label className="admin-label">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Synopsis</label>
              <RichTextEditor content={form.synopsis} onChange={(html) => updateField("synopsis", html)} placeholder="Book synopsis..." />
            </div>
            <div>
              <label className="admin-label">Excerpt</label>
              <RichTextEditor content={form.excerpt} onChange={(html) => updateField("excerpt", html)} placeholder="Sample excerpt from the book..." />
            </div>
          </div>

          <div className="admin-card space-y-5">
            <h2 className="text-lg font-display text-white">Publishing Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Genre</label>
                <input type="text" value={form.genre} onChange={(e) => updateField("genre", e.target.value)} className="admin-input" placeholder="Literary Fiction" />
              </div>
              <div>
                <label className="admin-label">Publisher</label>
                <input type="text" value={form.publisher} onChange={(e) => updateField("publisher", e.target.value)} className="admin-input" placeholder="Publisher name" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">ISBN</label>
                <input type="text" value={form.isbn} onChange={(e) => updateField("isbn", e.target.value)} className="admin-input" placeholder="978-..." />
              </div>
              <div>
                <label className="admin-label">Buy Link</label>
                <input type="url" value={form.buyLink} onChange={(e) => updateField("buyLink", e.target.value)} className="admin-input" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card space-y-4">
            <h3 className="text-sm font-medium text-white">Publish</h3>
            <div>
              <label className="admin-label">Visibility</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="admin-input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Publication Status</label>
              <select value={form.pubStatus} onChange={(e) => updateField("pubStatus", e.target.value)} className="admin-input">
                <option value="Draft">Draft</option>
                <option value="Forthcoming">Forthcoming</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-800 text-gold-400" />
              <span className="text-sm text-charcoal-300">Feature on homepage</span>
            </label>
          </div>
          <div className="admin-card">
            <ImageUpload value={form.coverImage} onChange={(url) => updateField("coverImage", url)} label="Cover Image" />
          </div>
        </div>
      </div>
    </form>
  );
}
