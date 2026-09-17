"use client";

import React, { useState, useEffect } from "react";
import { DocSpaceItem, DocPageItem, TocItem } from "@/lib/types";
import { DocNavbar } from "./DocNavbar";
import { DocSidebar } from "./DocSidebar";
import { DocContent } from "./DocContent";
import { OnThisPage } from "./OnThisPage";
import { MobileTocBar } from "./MobileTocBar";
import { SidebarSimple } from "@phosphor-icons/react";

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
    <div className="min-h-screen bg-kumo-canvas text-kumo-default flex flex-col">
      {/* Top Navbar */}
      <DocNavbar
        spaces={spaces}
        currentSpaceSlug={space.slug}
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        isSidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isTocCollapsed={tocCollapsed}
        onToggleToc={toggleToc}
        hasToc={hasToc}
      />

      {/* Mobile / Tablet Sticky Table of Contents Sub-bar (< xl) */}
      <MobileTocBar tocItems={tocAnchors} />

      {/* Desktop Floating Sidebar Re-open Edge Button (lg+) */}
      {isMounted && sidebarCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex fixed left-0 top-16 z-20 items-center justify-center p-1.5 bg-kumo-canvas/90 backdrop-blur border border-l-0 border-kumo-line rounded-r-md shadow-xs text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint transition-none"
          title="Expand navigation sidebar"
          aria-label="Expand sidebar"
        >
          <SidebarSimple weight="thin" size={16} />
        </button>
      )}

      {/* Desktop Floating TOC Re-open Edge Button (xl+) */}
      {isMounted && hasToc && tocCollapsed && (
        <button
          type="button"
          onClick={toggleToc}
          className="hidden xl:flex fixed right-0 top-16 z-20 items-center justify-center p-1.5 bg-kumo-canvas/90 backdrop-blur border border-r-0 border-kumo-line rounded-l-md shadow-xs text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-tint transition-none"
          title="Expand table of contents"
          aria-label="Expand table of contents"
        >
          <SidebarSimple weight="thin" size={16} className="rotate-180" />
        </button>
      )}

      {/* 3-Column Layout Container */}
      <div className="w-full max-w-[96rem] mx-auto flex justify-between min-w-0 flex-1">
        {/* Left Sidebar (Desktop collapsible aside + Mobile drawer) */}
        <DocSidebar
          spaces={spaces}
          space={space}
          currentPageSlug={page.slug}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
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
    </div>
  );
}
