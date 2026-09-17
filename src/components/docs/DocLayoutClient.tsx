"use client";

import React, { useState, useEffect } from "react";
import { DocSpaceItem, DocPageItem, TocItem } from "@/lib/types";
import { DocNavbar } from "./DocNavbar";
import { DocSidebar } from "./DocSidebar";
import { DocContent } from "./DocContent";
import { OnThisPage } from "./OnThisPage";
import { MobileTocBar } from "./MobileTocBar";
import { SearchModal } from "./SearchModal";

interface DocLayoutClientProps {
  spaces: DocSpaceItem[];
  space: DocSpaceItem;
  page: DocPageItem;
  tocAnchors: TocItem[];
}

export function DocLayoutClient({
  spaces,
  space,
  page,
  tocAnchors,
}: DocLayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Restore saved collapse preferences from localStorage upon client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedSidebar = localStorage.getItem("kumo_sidebar_collapsed");
      if (storedSidebar !== null) {
        setSidebarCollapsed(storedSidebar === "true");
      }
      const storedToc = localStorage.getItem("kumo_toc_collapsed");
      if (storedToc !== null) {
        setTocCollapsed(storedToc === "true");
      }
    } catch {
      // localStorage may be disabled in private browsing or iframe
    }
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kumo_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleToc = () => {
    setTocCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("kumo_toc_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const visibleTocItems = tocAnchors.filter((item) => item.enabled !== false);
  const hasToc = visibleTocItems.length > 0;

  return (
    <div className="min-h-screen bg-kumo-canvas text-kumo-default flex flex-col antialiased">
      {/* Top Navbar */}
      <DocNavbar
        spaces={spaces}
        currentSpaceSlug={space.slug}
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isTocCollapsed={tocCollapsed}
        onToggleToc={toggleToc}
        hasToc={hasToc}
      />

      {/* Mobile / Tablet Sticky Table of Contents Sub-bar (< xl) */}
      <MobileTocBar tocItems={tocAnchors} />

      {/* 3-Column Layout Container - Centered on mobile/tablet */}
      <div className="w-full max-w-[96rem] mx-auto flex justify-center lg:justify-between min-w-0 flex-1">
        {/* Left Sidebar (Desktop collapsible aside + Mobile slide-out drawer) */}
        <DocSidebar
          spaces={spaces}
          space={space}
          currentPageSlug={page.slug}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Center Main Content Area */}
        <DocContent
          space={space}
          page={page}
          tocAnchors={tocAnchors}
          sidebarCollapsed={sidebarCollapsed}
          tocCollapsed={tocCollapsed}
        />

        {/* Right Sidebar: On This Page */}
        <OnThisPage
          tocItems={tocAnchors}
          isCollapsed={tocCollapsed}
          onToggleCollapse={toggleToc}
        />
      </div>

      {/* Global Command Palette / Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
