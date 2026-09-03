"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Film, Lightbulb, BookOpen, MessageSquare, Plus, Clock } from "lucide-react";

interface DashboardData {
  worksCount: number;
  inDevCount: number;
  novelsCount: number;
  messagesCount: number;
  unreadMessages: number;
  recentWorks: { id: string; title: string; updatedAt: string; status: string }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const [works, inDev, novels, msgs] = await Promise.all([
        fetch("/api/works").then((r) => r.json()),
        fetch("/api/in-development").then((r) => r.json()),
        fetch("/api/novels").then((r) => r.json()),
        fetch("/api/contact").then((r) => r.json()).catch(() => []),
      ]);

      const allWorks = Array.isArray(works) ? works : [];
      const allInDev = Array.isArray(inDev) ? inDev : [];
      const allNovels = Array.isArray(novels) ? novels : [];
      const allMsgs = Array.isArray(msgs) ? msgs : [];

      setData({
        worksCount: allWorks.length,
        inDevCount: allInDev.length,
        novelsCount: allNovels.length,
        messagesCount: allMsgs.length,
        unreadMessages: allMsgs.filter((m: { read: boolean }) => !m.read).length,
        recentWorks: allWorks
          .sort((a: { updatedAt: string }, b: { updatedAt: string }) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5)
          .map((w: { id: string; title: string; updatedAt: string; status: string }) => ({
            id: w.id,
            title: w.title,
            updatedAt: w.updatedAt,
            status: w.status,
          })),
      });
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-charcoal-800 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-charcoal-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Works",
      count: data.worksCount,
      icon: Film,
      href: "/admin/works",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "In Development",
      count: data.inDevCount,
      icon: Lightbulb,
      href: "/admin/in-development",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Novels",
      count: data.novelsCount,
      icon: BookOpen,
      href: "/admin/novels",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Messages",
      count: data.messagesCount,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-green-400",
      bg: "bg-green-400/10",
      badge: data.unreadMessages > 0 ? data.unreadMessages : undefined,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-white">Dashboard</h1>
          <p className="text-charcoal-400 text-sm mt-1">
            Manage your portfolio content
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="admin-card hover:border-charcoal-600 transition-colors cursor-pointer relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-charcoal-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-display text-white mt-2">
                      {stat.count}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                    <Icon size={20} className={stat.color} />
                  </div>
                </div>
                {stat.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {stat.badge} new
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="text-lg font-display text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/works/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700/50 hover:bg-charcoal-700 transition-colors text-sm text-charcoal-300 hover:text-white"
            >
              <Plus size={16} className="text-gold-400" />
              Add new work
            </Link>
            <Link
              href="/admin/in-development/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700/50 hover:bg-charcoal-700 transition-colors text-sm text-charcoal-300 hover:text-white"
            >
              <Plus size={16} className="text-gold-400" />
              Add in-development project
            </Link>
            <Link
              href="/admin/novels/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700/50 hover:bg-charcoal-700 transition-colors text-sm text-charcoal-300 hover:text-white"
            >
              <Plus size={16} className="text-gold-400" />
              Add novel
            </Link>
          </div>
        </div>

        {/* Recent Edits */}
        <div className="admin-card">
          <h2 className="text-lg font-display text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gold-400" />
            Recent Edits
          </h2>
          {data.recentWorks.length > 0 ? (
            <div className="space-y-3">
              {data.recentWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/admin/works/${work.id}/edit`}
                  className="flex items-center justify-between py-2 border-b border-charcoal-700/50 last:border-0 hover:text-gold-400 transition-colors"
                >
                  <span className="text-sm text-charcoal-300">
                    {work.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        work.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-charcoal-600/50 text-charcoal-400"
                      }`}
                    >
                      {work.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-500">No works yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
