"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Film, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-charcoal-800 rounded-xl border border-charcoal-700 mb-4">
            <Film size={28} className="text-gold-400" />
          </div>
          <h1 className="font-display text-3xl text-white mb-2">
            Editorial CMS
          </h1>
          <p className="text-charcoal-400 text-sm">
            Sign in to manage your portfolio
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-8 space-y-5"
        >
          <div>
            <label htmlFor="email" className="admin-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              placeholder="director@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="admin-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full admin-btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
