"use client";

import React, { useState, useRef, useEffect } from "react";
import { Copy, CaretDown, Check, LinkSimple, FileText } from "@phosphor-icons/react";

interface CopyPageDropdownProps {
  title: string;
  markdownContent: string;
}

export function CopyPageDropdown({ title, markdownContent }: CopyPageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => {
        setCopiedType(null);
        setOpen(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative inline-block text-left mb-4" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none select-none"
      >
        <Copy weight="thin" size={14} />
        <span>Copy page</span>
        <CaretDown weight="thin" size={12} className="text-kumo-subtle" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-48 rounded-md border border-kumo-line bg-kumo-elevated shadow-lg z-30 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
          <button
            onClick={() => copyToClipboard(window.location.href, "url")}
            className="w-full flex items-center justify-between px-3 py-2 text-left text-kumo-default hover:bg-kumo-tint transition-none"
          >
            <div className="flex items-center gap-2">
              <LinkSimple weight="thin" size={14} />
              <span>Copy page URL</span>
            </div>
            {copiedType === "url" && <Check weight="thin" size={14} className="text-emerald-500" />}
          </button>

          <button
            onClick={() => copyToClipboard(markdownContent, "markdown")}
            className="w-full flex items-center justify-between px-3 py-2 text-left text-kumo-default hover:bg-kumo-tint transition-none"
          >
            <div className="flex items-center gap-2">
              <FileText weight="thin" size={14} />
              <span>Copy Markdown</span>
            </div>
            {copiedType === "markdown" && <Check weight="thin" size={14} className="text-emerald-500" />}
          </button>

          <button
            onClick={() => copyToClipboard(title, "title")}
            className="w-full flex items-center justify-between px-3 py-2 text-left text-kumo-default hover:bg-kumo-tint transition-none"
          >
            <div className="flex items-center gap-2">
              <Copy weight="thin" size={14} />
              <span>Copy title</span>
            </div>
            {copiedType === "title" && <Check weight="thin" size={14} className="text-emerald-500" />}
          </button>
        </div>
      )}
    </div>
  );
}
