"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/kumo/ThemeToggle";
import { ArrowSquareOut, SignOut, ShieldCheck } from "@phosphor-icons/react";

export function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-12 kumo-glass-nav border-b border-kumo-line flex items-center justify-between px-6 select-none">
      <div className="flex items-center gap-3">
        <ShieldCheck weight="thin" size={20} className="text-kumo-brand" />
        <span className="font-semibold text-sm text-kumo-strong">Kumo Admin Console</span>
        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-kumo-control border border-kumo-line text-kumo-subtle">
          Internal Tooling
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-kumo-line hover:bg-kumo-tint text-kumo-default transition-none"
        >
          <span>View live docs</span>
          <ArrowSquareOut weight="thin" size={13} />
        </Link>

        <div className="h-4 w-px bg-kumo-hairline" />

        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded text-kumo-subtle hover:text-red-500 hover:bg-red-500/10 transition-none"
          title="Sign out of Admin"
        >
          <SignOut weight="thin" size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
