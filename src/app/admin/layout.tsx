"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="text-gold-400 animate-pulse font-display text-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!session && pathname !== "/admin/login") return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-charcoal-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#222222",
            color: "#ffffff",
            border: "1px solid #303030",
          },
          success: {
            iconTheme: { primary: "#C6A84E", secondary: "#1a1a1a" },
          },
        }}
      />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminGuard>{children}</AdminGuard>
    </SessionProvider>
  );
}
