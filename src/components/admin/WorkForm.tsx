"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { generateSlug } from "@/lib/utils";
import { Save, Eye, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface WorkFormData {
  id?: string;
  title: string;
  slug: string;
  year: string;
  role: string;
  logline: string;
  description: string;
  poster: string | null;
  trailerUrl: string;
  genre: string;
  runtime: string;
  festivals: string;
  credits: string;
  tags: string;
  pdfUrl: string;
  featured: boolean;
  status: string;
}

interface WorkFormProps {
  initialData?: WorkFormData;
  isEdit?: boolean;
}

const defaultData: WorkFormData = {
  title: "",
  slug: "",
  year: "",
  role: "Director",
  logline: "",
  description: "",
  poster: null,
  trailerUrl: "",
  genre: "",
  runtime: "",
  festivals: "[]",
  credits: "[]",
  tags: "",
  pdfUrl: "",
  featured: false,
  status: "draft",
};

export default function WorkForm({ initialData, isEdit }: WorkFormProps) {
  const [form, setForm] = useState<WorkFormData>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const updateField = (field: keyof WorkFormData, value: string | boolean | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !isEdit
        ? { slug: generateSlug(value as string) }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const url = isEdit ? `/api/works/${form.id}` : "/api/works";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.year || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(isEdit ? "Work updated!" : "Work created!");
      router.push("/admin/works");
      router.refresh();
    } catch {
      toast.error("Failed to save work");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/works"
            className="p-2 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-display text-white">
              {isEdit ? "Edit Work" : "New Work"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && form.slug && (
            <Link
              href={`/works/${form.slug}`}
              target="_blank"
              className="admin-btn-secondary flex items-center gap-2"
            >
              <Eye size={16} />
              Preview
            </Link>
          )}
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary flex items-center gap-2"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main Column */}
        <div className="space-y-6">
          <div className="admin-card space-y-5">
            <div>
              <label className="admin-label">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="admin-input"
                placeholder="Film title"
                required
              />
            </div>

            <div>
              <label className="admin-label">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className="admin-input"
                placeholder="auto-generated-from-title"
              />
            </div>

            <div>
              <label className="admin-label">Logline</label>
              <textarea
                value={form.logline}
                onChange={(e) => updateField("logline", e.target.value)}
                className="admin-input resize-none"
                rows={2}
                placeholder="A brief one-line description..."
              />
            </div>

            <div>
              <label className="admin-label">Description</label>
              <RichTextEditor
                content={form.description}
                onChange={(html) => updateField("description", html)}
                placeholder="Full description of the work..."
              />
            </div>
          </div>

          {/* Details */}
          <div className="admin-card space-y-5">
            <h2 className="text-lg font-display text-white">Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="admin-label">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="admin-input"
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="admin-label">Runtime (minutes)</label>
                <input
                  type="text"
                  value={form.runtime}
                  onChange={(e) => updateField("runtime", e.target.value)}
                  className="admin-input"
                  placeholder="105"
                />
              </div>
              <div>
                <label className="admin-label">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="admin-input"
                  placeholder="Director, Writer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Genre</label>
                <input
                  type="text"
                  value={form.genre}
                  onChange={(e) => updateField("genre", e.target.value)}
                  className="admin-input"
                  placeholder="Drama, Thriller"
                />
              </div>
              <div>
                <label className="admin-label">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  className="admin-input"
                  placeholder="Comma-separated tags"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Trailer URL (YouTube/Vimeo)</label>
              <input
                type="url"
                value={form.trailerUrl}
                onChange={(e) => updateField("trailerUrl", e.target.value)}
                className="admin-input"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="admin-label">PDF URL (Treatment/Lookbook)</label>
              <input
                type="url"
                value={form.pdfUrl}
                onChange={(e) => updateField("pdfUrl", e.target.value)}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="admin-card space-y-4">
            <h3 className="text-sm font-medium text-white">Publish</h3>

            <div>
              <label className="admin-label">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="admin-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="w-4 h-4 rounded border-charcoal-600 bg-charcoal-800 text-gold-400 focus:ring-gold-400"
              />
              <span className="text-sm text-charcoal-300">
                Feature on homepage
              </span>
            </label>
          </div>

          {/* Poster */}
          <div className="admin-card">
            <ImageUpload
              value={form.poster}
              onChange={(url) => updateField("poster", url)}
              label="Poster Image"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
