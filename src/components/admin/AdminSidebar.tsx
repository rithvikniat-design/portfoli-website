"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Lightbulb,
  BookOpen,
  User,
  Settings,
  ImageIcon,
  MessageSquare,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/works", label: "Works", icon: Film },
  { href: "/admin/in-development", label: "In Development", icon: Lightbulb },
  { href: "/admin/novels", label: "Novels", icon: BookOpen },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-charcoal-900 border-r border-charcoal-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-charcoal-800">
        <Link href="/admin" className="font-display text-xl text-white">
          A<span className="text-gold-400">.</span> Menon
        </Link>
        <p className="text-xs text-charcoal-500 mt-1">Editorial CMS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-gold-400/10 text-gold-400 border border-gold-400/20"
                  : "text-charcoal-400 hover:text-white hover:bg-charcoal-800"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-charcoal-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <ChevronLeft size={18} />
          View Live Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-charcoal-400 hover:text-red-400 hover:bg-charcoal-800 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
