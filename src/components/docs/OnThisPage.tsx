"use client";

import React, { useEffect, useState } from "react";
import { TocItem } from "@/lib/types";

interface OnThisPageProps {
  tocItems: TocItem[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function OnThisPage({
  tocItems,
  isCollapsed = false,
  onToggleCollapse,
}: OnThisPageProps) {
  // Only display items that are enabled
  const visibleItems = tocItems.filter((item) => item.enabled !== false);
  const [activeId, setActiveId] = useState<string>(visibleItems[0]?.id || "");

  useEffect(() => {
    if (visibleItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = visibleItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 100;

      let currentId = visibleItems[0].id;
      for (const el of headingElements) {
        if (el.offsetTop <= scrollPosition) {
          currentId = el.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleItems]);

  if (visibleItems.length === 0) return null;

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <aside
      className={`hidden xl:block border-l border-kumo-line bg-kumo-canvas h-[calc(100vh-3rem)] sticky top-12 overflow-y-auto select-none transition-all duration-200 ease-in-out shrink-0 ${
        isCollapsed
          ? "w-0 p-0 border-l-0 overflow-hidden opacity-0 pointer-events-none"
          : "w-60 px-6 py-6 opacity-100"
      }`}
    >
      {!isCollapsed && (
        <>
          <div className="mb-4">
            <div className="text-[11px] font-semibold tracking-wider uppercase text-kumo-subtle">
              ON THIS PAGE
            </div>
          </div>

          <nav className="relative flex flex-col space-y-2 text-[13px]">
            {visibleItems.map((item) => {
              const isActive = activeId === item.id;
              const isH3 = item.level === 3;

              return (
                <div key={item.id} className="relative flex items-center">
                  {/* Active Blue Indicator Bar */}
                  {isActive && (
                    <span className="absolute -left-6 top-0 bottom-0 w-[2px] bg-blue-600 rounded-full" />
                  )}

                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`transition-none block truncate ${
                      isH3 ? "pl-4 text-xs" : ""
                    } ${
                      isActive
                        ? "font-semibold text-kumo-strong"
                        : "text-kumo-subtle hover:text-kumo-default"
                    }`}
                    title={item.text}
                  >
                    {item.text}
                  </a>
                </div>
              );
            })}
          </nav>
        </>
      )}
    </aside>
  );
}
