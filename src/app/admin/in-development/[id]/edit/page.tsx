"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InDevForm from "@/components/admin/InDevForm";

export default function EditInDevPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/in-development/${params.id}`).then(r => r.json()).then(p => {
      setData({ ...p, id: p.id });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="animate-pulse"><div className="h-96 bg-charcoal-800 rounded-xl" /></div>;
  if (!data) return <p className="text-charcoal-400">Not found</p>;
  return <InDevForm initialData={data} isEdit />;
}
