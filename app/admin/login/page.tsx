"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { profile } from "@/lib/data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Incorrect password");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-ink font-sans selection:bg-accent/15 selection:text-accent">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 sm:p-12 border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.06)] text-center transition-all duration-500 ease-apple">
        {/* Profile Avatar matching Hero */}
        <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full ring-1 ring-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <Image
            src={profile.photo}
            alt={profile.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
          Portfolio CMS
        </p>
        <h1 className="text-gradient text-3xl font-bold tracking-tightest3">
          Admin Sign In
        </h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          Enter your password to access the editing workspace and update your live portfolio.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4 text-left">
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoFocus
              className="w-full rounded-2xl border border-hair/80 bg-surface/50 px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/40 outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 transition-all duration-300"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200/80 p-3.5 text-xs font-medium text-rose-600 animate-fade-in-up">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="pill-btn bg-accent text-white hover:bg-accent-hover w-full py-3.5 mt-3 shadow-[0_4px_16px_rgba(0,113,227,0.25)] hover:shadow-[0_6px_24px_rgba(0,113,227,0.35)] disabled:opacity-50 transition-all duration-300"
          >
            {loading ? "Signing in..." : "Open Editor →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-hair/60 flex items-center justify-between text-xs text-muted">
          <a
            href="/"
            className="hover:text-ink transition-colors duration-200 flex items-center gap-1"
          >
            ← Back to Portfolio
          </a>
          <span>Protected Session</span>
        </div>
      </div>
    </div>
  );
}
