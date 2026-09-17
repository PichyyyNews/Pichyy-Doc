"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocSpaceItem, CategoryItem, DocPageItem } from "@/lib/types";
import { SearchModal } from "./SearchModal";
import { CaretDown, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";

interface DocSidebarProps {
  space: DocSpaceItem;
  currentPageSlug: string;
}

export function DocSidebar({ space, currentPageSlug }: DocSidebarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

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

  return (
    <>
      <aside className="w-64 flex-shrink-0 border-r border-kumo-line bg-kumo-canvas h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto px-4 py-4 select-none">
        {/* Search Bar Input (Trigger for Command Palette) */}
        <div className="mb-4">
          <button
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
            const isCollapsed = !!collapsedCategories[cat.id];
            const hasPages = cat.pages && cat.pages.length > 0;

            return (
              <div key={cat.id} className="mb-3">
                {/* Category Header with Chevron Toggle */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-kumo-strong hover:text-kumo-default transition-none rounded hover:bg-kumo-tint"
                >
                  <span className="truncate">{cat.name}</span>
                  {hasPages && (
                    <span className="text-kumo-subtle">
                      {isCollapsed ? (
                        <CaretRight weight="thin" size={12} />
                      ) : (
                        <CaretDown weight="thin" size={12} />
                      )}
                    </span>
                  )}
                </button>

                {/* Sub-pages */}
                {!isCollapsed && hasPages && (
                  <div className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-kumo-hairline pl-2">
                    {cat.pages!.map((page) => {
                      const isActive = page.slug === currentPageSlug;
                      const href = `/docs/${space.slug}/${page.slug}`;

                      return (
                        <Link
                          key={page.id}
                          href={href}
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
      </aside>

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
