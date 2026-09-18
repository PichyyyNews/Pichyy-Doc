"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocSpaceItem, CategoryItem, DocPageItem } from "@/lib/types";
import { SearchModal } from "./SearchModal";
import { Tooltip } from "@/components/ui/Tooltip";
import { CaretDown, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";

interface DocSidebarProps {
  spaces?: DocSpaceItem[];
  space: DocSpaceItem;
  currentPageSlug: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onOpenSearch?: () => void;
}

export function DocSidebar({
  spaces,
  space,
  currentPageSlug,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
  onOpenSearch,
}: DocSidebarProps) {
  const pathname = usePathname();
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Prevent background body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        onMobileClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onMobileClose]);

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSearchClick = () => {
    if (onOpenSearch) {
      if (isMobileOpen) onMobileClose?.();
      onOpenSearch();
    } else {
      if (isMobileOpen) onMobileClose?.();
      setInternalSearchOpen(true);
    }
  };

  // Group pages: uncategorized (root) pages first, then pages per category
  const rootPages = space.pages.filter((p) => !p.categoryId);
  const categoriesWithPages = space.categories.map((cat) => ({
    ...cat,
    pages: space.pages.filter((p) => p.categoryId === cat.id),
  }));

  const renderNavigationLinks = (isMobile = false) => (
    <nav className="flex flex-col gap-0.5">
      {rootPages.map((page) => {
        const isActive = page.slug === currentPageSlug;
        const href = `/docs/${space.slug}/${page.slug}`;

        return (
          <Link
            key={page.id}
            href={href}
            onClick={() => {
              if (isMobile) onMobileClose?.();
            }}
            className={`px-3 py-1.5 rounded-md text-sm transition-none flex items-center justify-between min-w-0 ${
              isActive
                ? "bg-kumo-tint text-kumo-strong font-medium"
                : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
            }`}
          >
            <Tooltip content={page.title} side="right" className="w-full">
              <span className="truncate block max-w-[200px]">{page.title}</span>
            </Tooltip>
          </Link>
        );
      })}

      {/* Hairline Divider if there are categories */}
      {categoriesWithPages.length > 0 && rootPages.length > 0 && (
        <div className="my-3 border-t border-kumo-hairline" />
      )}

      {/* Categorized Sections */}
      {categoriesWithPages.map((cat) => {
        const isCategoryCollapsed = !!collapsedCategories[cat.id];
        const hasPages = cat.pages && cat.pages.length > 0;

        return (
          <div key={cat.id} className="mb-3">
            {/* Category Header with Chevron Toggle */}
            <button
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-kumo-strong hover:text-kumo-default transition-none rounded hover:bg-kumo-tint min-w-0"
            >
              <Tooltip content={cat.name} side="right" className="min-w-0 flex-1">
                <span className="truncate block max-w-[170px] text-left">{cat.name}</span>
              </Tooltip>
              {hasPages && (
                <span className="text-kumo-subtle shrink-0 ml-1">
                  {isCategoryCollapsed ? (
                    <CaretRight weight="thin" size={12} />
                  ) : (
                    <CaretDown weight="thin" size={12} />
                  )}
                </span>
              )}
            </button>

            {/* Sub-pages */}
            {!isCategoryCollapsed && hasPages && (
              <div className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-kumo-hairline pl-2">
                {cat.pages!.map((page) => {
                  const isActive = page.slug === currentPageSlug;
                  const href = `/docs/${space.slug}/${page.slug}`;

                  return (
                    <Link
                      key={page.id}
                      href={href}
                      onClick={() => {
                        if (isMobile) onMobileClose?.();
                      }}
                      className={`px-2.5 py-1.5 rounded text-sm transition-none flex items-center min-w-0 ${
                        isActive
                          ? "bg-kumo-tint text-kumo-strong font-medium"
                          : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
                      }`}
                    >
                      <Tooltip content={page.title} side="right" className="w-full">
                        <span className="truncate block max-w-[175px]">{page.title}</span>
                      </Tooltip>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar (lg+) */}
      <aside
        className={`hidden lg:block border-r border-kumo-line bg-kumo-canvas h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto select-none transition-all duration-200 ease-in-out shrink-0 ${
          isCollapsed
            ? "w-0 p-0 border-r-0 overflow-hidden opacity-0 pointer-events-none"
            : "w-64 p-4 opacity-100"
        }`}
      >
        {!isCollapsed && (
          <>
            {/* Space Title Header */}
            <div className="pb-3 mb-3 border-b border-kumo-hairline">
              <span className="text-xs font-semibold uppercase tracking-wider text-kumo-subtle truncate block">
                {space.name}
              </span>
            </div>

            {/* Search Bar Input (Trigger for Command Palette) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleSearchClick}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-kumo-line bg-kumo-control text-xs text-kumo-subtle hover:bg-kumo-tint focus:outline-none transition-none text-left"
              >
                <div className="flex items-center gap-2">
                  <MagnifyingGlass weight="thin" size={15} />
                  <span>Search...</span>
                </div>
                <kbd className="text-[10px] font-mono px-1 py-0.2 rounded border border-kumo-hairline text-kumo-subtle">
                  ⌘K
                </kbd>
              </button>
            </div>

            {renderNavigationLinks(false)}
          </>
        )}
      </aside>

      {/* Mobile/Tablet Drawer (< lg) with Silky Slide Animation */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileOpen ? "visible" : "invisible pointer-events-none delay-200"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-out ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onMobileClose}
          aria-hidden="true"
        />

        {/* Slide-out Drawer Panel */}
        <div
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-kumo-canvas border-r border-kumo-line p-4 sm:p-5 overflow-y-auto shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-kumo-line">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                onClick={onMobileClose}
                className="font-handwriting font-bold text-2xl text-kumo-strong hover:opacity-85"
              >
                Pichyy
              </Link>
            </div>
            <button
              type="button"
              onClick={onMobileClose}
              className="p-1.5 text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint rounded transition-none"
              aria-label="Close menu"
            >
              <X weight="thin" size={18} />
            </button>
          </div>

          {/* Mobile-only Space Selector Segment */}
          {spaces && spaces.length > 1 && (
            <div className="mb-4 pb-3 border-b border-kumo-line">
              <div className="text-[10px] uppercase font-mono tracking-wider text-kumo-subtle mb-2">
                SELECT SPACE
              </div>
              <div className="flex flex-col gap-1">
                {spaces.map((sp) => {
                  const isActive = sp.slug === space.slug;
                  const targetPage = sp.pages[0]?.slug || "overview";
                  return (
                    <Link
                      key={sp.id}
                      href={`/docs/${sp.slug}/${targetPage}`}
                      onClick={onMobileClose}
                      className={`flex items-center px-3 py-2 text-xs rounded-md transition-none min-w-0 ${
                        isActive
                          ? "bg-kumo-tint font-semibold text-kumo-strong"
                          : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
                      }`}
                    >
                      <Tooltip content={sp.name} side="top" className="w-full">
                        <span className="truncate block max-w-[240px]">{sp.name}</span>
                      </Tooltip>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prominent Mobile Search Bar */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleSearchClick}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-kumo-line bg-kumo-control text-xs text-kumo-subtle hover:bg-kumo-tint transition-none text-left"
            >
              <div className="flex items-center gap-2">
                <MagnifyingGlass weight="thin" size={16} className="text-kumo-subtle" />
                <span>Search docs...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-kumo-recessed border border-kumo-hairline">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Current Space Nav Links */}
          <div className="text-[10px] uppercase font-mono tracking-wider text-kumo-subtle mb-2">
            NAVIGATION
          </div>
          <div className="flex-1">
            {renderNavigationLinks(true)}
          </div>

          {/* Mobile Drawer Footer */}
          <div className="mt-8 pt-4 border-t border-kumo-line flex items-center justify-between text-xs text-kumo-subtle">
            <Link
              href="/admin"
              onClick={onMobileClose}
              className="text-xs text-kumo-subtle hover:text-kumo-strong transition-none"
            >
              Admin Console
            </Link>
            <span className="text-[11px] font-mono text-kumo-subtle">Pichyy Docs</span>
          </div>
        </div>
      </div>

      {/* Internal Search Modal (fallback if not managed globally) */}
      <SearchModal
        open={internalSearchOpen}
        onClose={() => setInternalSearchOpen(false)}
      />
    </>
  );
}
