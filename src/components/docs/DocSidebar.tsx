"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocSpaceItem, CategoryItem, DocPageItem } from "@/lib/types";
import { SearchModal } from "./SearchModal";
import { CaretDown, CaretRight, MagnifyingGlass, SidebarSimple, X } from "@phosphor-icons/react";

interface DocSidebarProps {
  spaces?: DocSpaceItem[];
  space: DocSpaceItem;
  currentPageSlug: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DocSidebar({
  spaces,
  space,
  currentPageSlug,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: DocSidebarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Group pages: uncategorized (root) pages first, then pages per category
  const rootPages = space.pages.filter((p) => !p.categoryId);
  const categoriesWithPages = space.categories.map((cat) => ({
    ...cat,
    pages: space.pages.filter((p) => p.categoryId === cat.id),
  }));

  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Top Header Row with Title & Collapse / Close Trigger */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-kumo-hairline">
        <span className="text-xs font-semibold uppercase tracking-wider text-kumo-subtle truncate">
          {space.name}
        </span>
        {isMobile ? (
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1.5 text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint rounded transition-none"
            aria-label="Close menu"
          >
            <X weight="thin" size={16} />
          </button>
        ) : (
          onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint rounded transition-none"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <SidebarSimple weight="thin" size={16} />
            </button>
          )
        )}
      </div>

      {/* Mobile-only Space Selector if multiple spaces exist */}
      {isMobile && spaces && spaces.length > 1 && (
        <div className="mb-4 pb-3 border-b border-kumo-hairline">
          <div className="text-[10px] uppercase font-mono tracking-wider text-kumo-subtle mb-2">
            DOC SPACES
          </div>
          <div className="flex flex-wrap gap-1">
            {spaces.map((sp) => {
              const isActive = sp.slug === space.slug;
              const targetPage = sp.pages[0]?.slug || "overview";
              return (
                <Link
                  key={sp.id}
                  href={`/docs/${sp.slug}/${targetPage}`}
                  onClick={onMobileClose}
                  className={`px-2.5 py-1 text-xs rounded transition-none ${
                    isActive
                      ? "bg-kumo-tint font-semibold text-kumo-strong"
                      : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
                  }`}
                >
                  {sp.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Bar Input (Trigger for Command Palette) */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-kumo-line bg-kumo-control text-xs text-kumo-subtle hover:bg-kumo-tint focus:outline-none transition-none text-left"
        >
          <MagnifyingGlass weight="thin" size={16} />
          <span>Search...</span>
        </button>
      </div>

      {/* Root / Direct Links */}
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
              className={`px-3 py-1.5 rounded-md text-sm transition-none ${
                isActive
                  ? "bg-kumo-tint text-kumo-strong font-medium"
                  : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
              }`}
            >
              {page.title}
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
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-kumo-strong hover:text-kumo-default transition-none rounded hover:bg-kumo-tint"
              >
                <span className="truncate">{cat.name}</span>
                {hasPages && (
                  <span className="text-kumo-subtle">
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
                        className={`px-2.5 py-1 rounded text-sm transition-none truncate ${
                          isActive
                            ? "bg-kumo-tint text-kumo-strong font-medium"
                            : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint"
                        }`}
                      >
                        {page.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
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
        {!isCollapsed && renderSidebarContent(false)}
      </aside>

      {/* Mobile/Tablet Drawer (< lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-kumo-canvas border-r border-kumo-line p-4 overflow-y-auto shadow-2xl flex flex-col z-10 transition-transform duration-200 ease-in-out">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
