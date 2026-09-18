"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  onlyWhenTruncated?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  onlyWhenTruncated = true,
  className = "",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const gap = 6;

    if (side === "top") {
      top = rect.top - gap;
      left = rect.left + rect.width / 2;
    } else if (side === "bottom") {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2;
    } else if (side === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - gap;
    } else if (side === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + gap;
    }

    setCoords({ top, left });
  }, [side]);

  const handleMouseEnter = () => {
    if (!triggerRef.current || !content) return;

    if (onlyWhenTruncated) {
      // Find the element with text to check if it's truncated
      const el = triggerRef.current;
      const target =
        (el.firstElementChild as HTMLElement) ||
        (el.querySelector(".truncate") as HTMLElement) ||
        el;

      // Allow 1px tolerance for subpixel rounding
      const isTruncated = target.scrollWidth > target.clientWidth + 1;
      if (!isTruncated) {
        return;
      }
    }

    updatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Close when window scrolls or resizes
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => setIsOpen(false);
    window.addEventListener("scroll", handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  // Determine transform & arrow style based on side
  const getTransform = () => {
    switch (side) {
      case "top":
        return "translate(-50%, -100%)";
      case "bottom":
        return "translate(-50%, 0)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0, -50%)";
    }
  };

  const getArrowClasses = () => {
    switch (side) {
      case "top":
        return "bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r";
      case "bottom":
        return "top-[-4px] left-1/2 -translate-x-1/2 border-t border-l";
      case "left":
        return "right-[-4px] top-1/2 -translate-y-1/2 border-t border-r";
      case "right":
        return "left-[-4px] top-1/2 -translate-y-1/2 border-b border-l";
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className={`inline-flex min-w-0 max-w-full ${className}`}
      >
        {children}
      </div>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: getTransform(),
            }}
            className="z-[9999] pointer-events-none px-2.5 py-1 text-xs rounded shadow-lg select-none font-medium whitespace-nowrap bg-neutral-900 text-neutral-100 border border-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-200 transition-opacity duration-100"
          >
            {content}
            {/* Tooltip Arrow */}
            <div
              className={`absolute w-2 h-2 rotate-45 bg-neutral-900 border-neutral-800 dark:bg-neutral-100 dark:border-neutral-200 ${getArrowClasses()}`}
            />
          </div>,
          document.body
        )}
    </>
  );
}
