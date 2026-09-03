"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { generateSlug } from "@/lib/utils";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface InDevFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function InDevForm({ initialData, isEdit }: InDevFormProps) {
  const [form, setForm] = useState(initialData || {
    title: "", slug: "", concept: "", treatment: "", devStatus: "Concept",
    poster: null, genre: "", tags: "", featured: false, status: "draft",
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
      const url = isEdit ? `/api/in-development/${form.id}` : "/api/in-development";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Updated!" : "Created!");
      router.push("/admin/in-development");
      router.refresh();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/in-development" className="p-2 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-display text-white">{isEdit ? "Edit Project" : "New Project"}</h1>
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <div className="admin-card space-y-5">
            <div>
              <label className="admin-label">Title *</label>
              <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="admin-input" required placeholder="Project title" />
            </div>
            <div>
              <label className="admin-label">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Concept</label>
              <RichTextEditor content={form.concept} onChange={(html) => updateField("concept", html)} placeholder="Describe the concept..." />
            </div>
            <div>
              <label className="admin-label">Treatment</label>
              <RichTextEditor content={form.treatment} onChange={(html) => updateField("treatment", html)} placeholder="Detailed treatment..." />
            </div>
          </div>
          <div className="admin-card space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Genre</label>
                <input type="text" value={form.genre} onChange={(e) => updateField("genre", e.target.value)} className="admin-input" placeholder="Drama, Sci-Fi" />
              </div>
              <div>
                <label className="admin-label">Tags</label>
                <input type="text" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} className="admin-input" placeholder="Comma-separated" />
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
              <label className="admin-label">Development Status</label>
              <select value={form.devStatus} onChange={(e) => updateField("devStatus", e.target.value)} className="admin-input">
                <option value="Concept">Concept</option>
                <option value="Treatment">Treatment</option>
                <option value="Pre-Production">Pre-Production</option>
                <option value="Financing">Financing</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-800 text-gold-400" />
              <span className="text-sm text-charcoal-300">Feature on homepage</span>
            </label>
          </div>
          <div className="admin-card">
            <ImageUpload value={form.poster} onChange={(url) => updateField("poster", url)} label="Poster / Concept Art" />
          </div>
        </div>
      </div>
    </form>
  );
}
