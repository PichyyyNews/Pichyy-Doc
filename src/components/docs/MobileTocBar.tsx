"use client";

import React, { useState, useEffect, useRef } from "react";
import { TocItem } from "@/lib/types";
import { CaretDown, CaretUp, ListBullets } from "@phosphor-icons/react";

interface MobileTocBarProps {
  tocItems: TocItem[];
}

export function MobileTocBar({ tocItems }: MobileTocBarProps) {
  const visibleItems = tocItems.filter((item) => item.enabled !== false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(visibleItems[0]?.id || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll spy to track currently visible heading
  useEffect(() => {
    if (visibleItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = visibleItems
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (headingElements.length === 0) return;

      // Account for 48px navbar + 40px TOC bar + safety buffer = 110px
      const scrollPosition = window.scrollY + 110;

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (visibleItems.length === 0) return null;

  const activeItem = visibleItems.find((item) => item.id === activeId) || visibleItems[0];

  const handleSelectHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);

    const el = document.getElementById(id);
    if (el) {
      // Navbar (48px) + MobileTocBar (40px) + 12px margin = 100px offset
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="xl:hidden sticky top-12 z-30 w-full kumo-glass-nav border-b border-kumo-line select-none transition-colors"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center justify-between px-4 text-xs text-kumo-default hover:bg-kumo-tint/40 transition-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 mr-2">
          <ListBullets weight="thin" size={16} className="text-kumo-subtle shrink-0" />
          <span className="text-kumo-subtle shrink-0 font-medium">On this page:</span>
          <span className="font-semibold text-kumo-strong truncate">
            {activeItem?.text || "Table of contents"}
          </span>
        </div>
        <div className="shrink-0 text-kumo-subtle p-1">
          {isOpen ? (
            <CaretUp weight="thin" size={14} />
          ) : (
            <CaretDown weight="thin" size={14} />
          )}
        </div>
      </button>

      {/* Accordion Menu Panel */}
      {isOpen && (
        <div className="border-t border-kumo-hairline bg-kumo-canvas/98 backdrop-blur-md max-h-[60vh] overflow-y-auto px-4 py-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] uppercase font-mono tracking-wider text-kumo-subtle mb-2.5">
            TABLE OF CONTENTS
          </div>
          <nav className="flex flex-col space-y-1.5 text-xs">
            {visibleItems.map((item) => {
              const isActive = activeId === item.id;
              const isH3 = item.level === 3;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleSelectHeading(item.id, e)}
                  className={`block py-1.5 px-2 rounded transition-none truncate ${
                    isH3 ? "pl-5 text-[11px]" : "font-medium text-xs"
                  } ${
                    isActive
                      ? "bg-kumo-tint text-kumo-brand font-semibold border-l-2 border-kumo-brand"
                      : "text-kumo-subtle hover:text-kumo-default hover:bg-kumo-tint/60"
                  }`}
                >
                  {item.text}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
