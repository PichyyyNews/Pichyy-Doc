"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKey, ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid PIN code");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kumo-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-kumo-line bg-kumo-base p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck weight="thin" size={24} className="text-kumo-brand shrink-0" />
          <h1 className="text-lg font-semibold text-kumo-strong flex items-center">
            <span className="font-handwriting font-bold text-2xl mr-1.5">Pichyy</span>
            <span>Admin</span>
          </h1>
        </div>
        <p className="text-xs text-kumo-subtle mb-6">
          Enter the administrator PIN to manage doc spaces, hierarchy, and contents.
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-kumo-subtle mb-1.5">
              Admin PIN
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-kumo-subtle">
                <LockKey weight="thin" size={16} />
              </span>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit PIN..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand focus:ring-1 focus:ring-kumo-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-xs font-medium text-kumo-brand-foreground bg-kumo-brand hover:bg-kumo-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-none"
          >
            <span>{loading ? "Verifying..." : "Access Admin"}</span>
            <ArrowRight weight="thin" size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-kumo-hairline flex items-center justify-between text-xs text-kumo-subtle">
          <Link href="/" className="hover:text-kumo-default transition-none">
            ← Back to Docs
          </Link>
          <span className="font-mono text-[11px]">PIN configured in .env</span>
        </div>
      </div>
    </div>
  );
}
