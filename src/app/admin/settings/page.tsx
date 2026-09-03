"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    siteName: "Director Portfolio",
    tagline: "",
    heroSubtitle: "",
    contactEmail: "",
    socialLinks: [] as { platform: string; url: string }[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      setForm({
        siteName: data.siteName || "",
        tagline: data.tagline || "",
        heroSubtitle: data.heroSubtitle || "",
        contactEmail: data.contactEmail || "",
        socialLinks: data.socialLinks ? JSON.parse(data.socialLinks) : [],
      });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, socialLinks: JSON.stringify(form.socialLinks) }),
      });
      if (res.ok) toast.success("Settings updated");
      else toast.error("Failed to update");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse h-64 bg-charcoal-800 rounded-xl" />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display text-white">Site Settings</h1>
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="admin-card space-y-5">
          <h2 className="text-lg font-display text-white mb-2">Global Settings</h2>
          <div>
            <label className="admin-label">Site Name</label>
            <input type="text" value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Hero Tagline</label>
            <input type="text" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Hero Subtitle</label>
            <input type="text" value={form.heroSubtitle} onChange={e => setForm({...form, heroSubtitle: e.target.value})} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Contact Email (for form submissions)</label>
            <input type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} className="admin-input" />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="text-lg font-display text-white mb-4">Social Links</h2>
          <div className="space-y-3 mb-4">
            {form.socialLinks.map((social, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input type="text" value={social.platform} onChange={(e) => { const s = [...form.socialLinks]; s[i].platform = e.target.value; setForm({ ...form, socialLinks: s }); }} className="admin-input w-1/3" placeholder="Platform (IMDb)" />
                <input type="url" value={social.url} onChange={(e) => { const s = [...form.socialLinks]; s[i].url = e.target.value; setForm({ ...form, socialLinks: s }); }} className="admin-input flex-1" placeholder="URL" />
                <button type="button" onClick={() => { const s = [...form.socialLinks]; s.splice(i, 1); setForm({ ...form, socialLinks: s }); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded">X</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setForm({ ...form, socialLinks: [...form.socialLinks, { platform: "", url: "" }] })} className="text-sm text-gold-400 hover:text-gold-300">+ Add Social Link</button>
        </div>
      </div>
    </form>
  );
}
