"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-[#161618] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent text-2xl mb-4 border border-accent/20">
            🔐
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio Admin</h1>
          <p className="text-sm text-white/50 mt-1.5">
            Enter your admin password to edit your portfolio.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-white/60 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white hover:bg-accent-hover transition-all duration-200 disabled:opacity-50 mt-2 shadow-lg shadow-accent/20"
          >
            {loading ? "Signing in..." : "Enter Admin Dashboard →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            Default password: <code className="text-white/70 bg-white/10 px-2 py-0.5 rounded font-mono">admin123</code>
          </p>
          <p className="text-[11px] text-white/30 mt-1">
            (You can customize this anytime via <code className="font-mono text-white/50">ADMIN_PASSWORD</code> in your environment variables).
          </p>
        </div>
      </div>
    </div>
  );
}

