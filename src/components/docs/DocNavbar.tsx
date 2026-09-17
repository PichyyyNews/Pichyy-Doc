"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocSpaceItem } from "@/lib/types";
import { ThemeToggle } from "@/components/kumo/ThemeToggle";
import { CaretDown, List, MagnifyingGlass, SidebarSimple } from "@phosphor-icons/react";

interface DocNavbarProps {
  spaces: DocSpaceItem[];
  currentSpaceSlug?: string;
  onToggleMobileSidebar?: () => void;
  onOpenSearch?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isTocCollapsed?: boolean;
  onToggleToc?: () => void;
  hasToc?: boolean;
}

export function DocNavbar({
  spaces,
  currentSpaceSlug,
  onToggleMobileSidebar,
  onOpenSearch,
  isSidebarCollapsed = false,
  onToggleSidebar,
  isTocCollapsed = false,
  onToggleToc,
  hasToc = false,
}: DocNavbarProps) {
  const pathname = usePathname();
  const currentSpace = spaces.find((s) => s.slug === currentSpaceSlug) || spaces[0];

  return (
    <header className="sticky top-0 z-40 w-full h-12 kumo-glass-nav border-b border-kumo-line flex items-center justify-between px-3 sm:px-6">
      {/* Left Section: Mobile Hamburger + Desktop Sidebar Toggle + Brand + Mobile Space Badge + Desktop Space Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Drawer Trigger (< lg) */}
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 -ml-1 rounded text-kumo-default hover:bg-kumo-tint transition-none shrink-0"
            aria-label="Open navigation menu"
          >
            <List weight="thin" size={20} />
          </button>
        )}

        {/* Desktop Sidebar Collapse / Expand Toggle (lg+) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`hidden lg:flex items-center justify-center p-1.5 rounded transition-none shrink-0 ${
              isSidebarCollapsed
                ? "text-kumo-brand bg-kumo-tint"
                : "text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint"
            }`}
            title={isSidebarCollapsed ? "Expand navigation sidebar" : "Collapse navigation sidebar"}
            aria-label="Toggle sidebar"
          >
            <SidebarSimple weight="thin" size={17} />
          </button>
        )}

        {/* Brand */}
        <Link
          href="/"
          className="font-semibold text-kumo-strong hover:opacity-85 select-none text-[15px] tracking-normal shrink-0"
        >
          Kumo
        </Link>

        {/* Mobile Doc Space Badge (< md) */}
        {currentSpace && onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden flex items-center gap-1 px-2 py-0.5 text-xs text-kumo-subtle hover:text-kumo-strong bg-kumo-control/80 border border-kumo-hairline rounded max-w-[130px] truncate transition-none"
            title="Switch documentation space"
          >
            <span className="truncate">{currentSpace.name}</span>
            <CaretDown weight="thin" size={11} className="shrink-0 opacity-70" />
          </button>
        )}

        {/* Desktop Navigation Spaces (md+) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
          {spaces.map((space) => {
            const isActive = space.slug === currentSpaceSlug;
            const targetPage = space.pages[0]?.slug || "overview";
            const href = `/docs/${space.slug}/${targetPage}`;

            return (
              <Link
                key={space.id}
                href={href}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-none select-none shrink-0 ${
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

      {/* Right Section: Mobile Search Button + Desktop TOC Toggle + Theme Toggle */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile / Universal Quick Search Button */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 rounded text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint transition-none"
            aria-label="Search documentation"
            title="Search documentation (⌘K)"
          >
            <MagnifyingGlass weight="thin" size={18} />
          </button>
        )}

        {/* Desktop On This Page Toggle (xl+) */}
        {hasToc && onToggleToc && (
          <button
            type="button"
            onClick={onToggleToc}
            className={`hidden xl:flex items-center justify-center p-1.5 rounded transition-none ${
              isTocCollapsed
                ? "text-kumo-brand bg-kumo-tint"
                : "text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint"
            }`}
            title={isTocCollapsed ? "Expand table of contents" : "Collapse table of contents"}
            aria-label="Toggle table of contents"
          >
            <SidebarSimple weight="thin" size={17} className="rotate-180" />
          </button>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
