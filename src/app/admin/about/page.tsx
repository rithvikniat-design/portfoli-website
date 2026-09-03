"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { Save, Loader2 } from "lucide-react";

export default function AdminAboutPage() {
  const [form, setForm] = useState({
    bio: "",
    portrait: null as string | null,
    awards: [] as { title: string; year: string; detail: string }[],
    press: [] as { title: string; outlet: string; url: string }[],
    collaborators: [] as { name: string; role: string; image: string }[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          bio: data.bio || "",
          portrait: data.portrait || null,
          awards: data.awards ? JSON.parse(data.awards) : [],
          press: data.press ? JSON.parse(data.press) : [],
          collaborators: data.collaborators ? JSON.parse(data.collaborators) : [],
        });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          awards: JSON.stringify(form.awards),
          press: JSON.stringify(form.press),
          collaborators: JSON.stringify(form.collaborators),
        }),
      });
      if (res.ok) toast.success("About page updated");
      else toast.error("Failed to update");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse"><div className="h-96 bg-charcoal-800 rounded-xl" /></div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">About Page</h1>
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <div className="admin-card">
            <h2 className="text-lg font-display text-white mb-4">Biography</h2>
            <RichTextEditor content={form.bio} onChange={(bio) => setForm({ ...form, bio })} placeholder="Write your biography..." />
          </div>

          <div className="admin-card">
            <h2 className="text-lg font-display text-white mb-4">Awards & Festivals</h2>
            <div className="space-y-3 mb-4">
              {form.awards.map((award, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input type="text" value={award.title} onChange={(e) => { const a = [...form.awards]; a[i].title = e.target.value; setForm({ ...form, awards: a }); }} className="admin-input flex-1" placeholder="Award Name" />
                  <input type="text" value={award.year} onChange={(e) => { const a = [...form.awards]; a[i].year = e.target.value; setForm({ ...form, awards: a }); }} className="admin-input w-24" placeholder="Year" />
                  <input type="text" value={award.detail} onChange={(e) => { const a = [...form.awards]; a[i].detail = e.target.value; setForm({ ...form, awards: a }); }} className="admin-input flex-1" placeholder="Category/Detail" />
                  <button type="button" onClick={() => { const a = [...form.awards]; a.splice(i, 1); setForm({ ...form, awards: a }); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">X</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setForm({ ...form, awards: [...form.awards, { title: "", year: "", detail: "" }] })} className="text-sm text-gold-400 hover:text-gold-300">+ Add Award</button>
          </div>
          
          <div className="admin-card">
            <h2 className="text-lg font-display text-white mb-4">Press</h2>
            <div className="space-y-3 mb-4">
              {form.press.map((p, i) => (
                <div key={i} className="flex flex-col gap-2 border border-charcoal-700 p-4 rounded-lg relative">
                  <input type="text" value={p.title} onChange={(e) => { const arr = [...form.press]; arr[i].title = e.target.value; setForm({ ...form, press: arr }); }} className="admin-input" placeholder="Quote or Title" />
                  <div className="flex gap-2">
                    <input type="text" value={p.outlet} onChange={(e) => { const arr = [...form.press]; arr[i].outlet = e.target.value; setForm({ ...form, press: arr }); }} className="admin-input w-1/3" placeholder="Outlet (e.g. Variety)" />
                    <input type="url" value={p.url} onChange={(e) => { const arr = [...form.press]; arr[i].url = e.target.value; setForm({ ...form, press: arr }); }} className="admin-input flex-1" placeholder="URL" />
                  </div>
                  <button type="button" onClick={() => { const arr = [...form.press]; arr.splice(i, 1); setForm({ ...form, press: arr }); }} className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-400/10 rounded">X</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setForm({ ...form, press: [...form.press, { title: "", outlet: "", url: "" }] })} className="text-sm text-gold-400 hover:text-gold-300">+ Add Press Item</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <ImageUpload value={form.portrait} onChange={(url) => setForm({ ...form, portrait: url })} label="Portrait" />
          </div>
        </div>
      </div>
    </form>
  );
}
