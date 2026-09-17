"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocSpaceItem } from "@/lib/types";
import { ThemeToggle } from "@/components/kumo/ThemeToggle";

interface DocNavbarProps {
  spaces: DocSpaceItem[];
  currentSpaceSlug?: string;
}

export function DocNavbar({ spaces, currentSpaceSlug }: DocNavbarProps) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-12 kumo-glass-nav border-b border-kumo-line flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand + Doc Spaces Tabs */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-semibold text-kumo-strong hover:opacity-85 select-none text-[15px] tracking-normal"
          >
            Kumo
          </Link>

          {/* Navigation spaces */}
          <nav className="hidden md:flex items-center gap-1">
            {spaces.map((space) => {
              const isActive = space.slug === currentSpaceSlug;
              // Default to first page in space or overview
              const targetPage = space.pages[0]?.slug || "overview";
              const href = `/docs/${space.slug}/${targetPage}`;

              return (
                <Link
                  key={space.id}
                  href={href}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-none select-none ${
                    isActive
                      ? "text-kumo-strong bg-kumo-tint font-semibold"
                      : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
                  }`}
                >
                  {space.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Only Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}

