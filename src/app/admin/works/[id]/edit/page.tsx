"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkForm from "@/components/admin/WorkForm";

export default function EditWorkPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/works/${params.id}`);
      if (res.ok) {
        const work = await res.json();
        setData({
          id: work.id,
          title: work.title,
          slug: work.slug,
          year: work.year?.toString() || "",
          role: work.role || "Director",
          logline: work.logline || "",
          description: work.description || "",
          poster: work.poster || null,
          trailerUrl: work.trailerUrl || "",
          genre: work.genre || "",
          runtime: work.runtime || "",
          festivals: work.festivals || "[]",
          credits: work.credits || "[]",
          tags: work.tags || "",
          pdfUrl: work.pdfUrl || "",
          featured: work.featured || false,
          status: work.status || "draft",
        });
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-charcoal-800 rounded w-48" />
        <div className="h-96 bg-charcoal-800 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-charcoal-400">Work not found</p>;
  }

  return <WorkForm initialData={data} isEdit />;
}
