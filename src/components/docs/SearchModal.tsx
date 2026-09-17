"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, FileText, Hash, Tag, X } from "@phosphor-icons/react";
import { SearchResultItem } from "@/lib/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Global shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else {
          // Open handled by parent if needed, but if modal handles self
        }
      } else if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Perform search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    router.push(item.url);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-kumo-line bg-kumo-elevated shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="flex items-center gap-2.5 px-3.5 sm:px-4 py-3 border-b border-kumo-hairline bg-kumo-base">
          <MagnifyingGlass weight="thin" size={20} className="text-kumo-subtle flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation, headings..."
            className="w-full bg-transparent text-sm text-kumo-default placeholder-kumo-subtle focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-kumo-subtle hover:text-kumo-default p-1 shrink-0"
              aria-label="Clear query"
            >
              <X weight="thin" size={16} />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded border border-kumo-line text-kumo-subtle font-mono shrink-0">
            ESC
          </span>
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden text-xs text-kumo-subtle hover:text-kumo-strong px-2 py-1 rounded hover:bg-kumo-tint shrink-0"
            aria-label="Close search"
          >
            Cancel
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="py-8 text-center text-xs text-kumo-subtle">Searching...</div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-xs text-kumo-subtle">
              No results found for &ldquo;<span className="text-kumo-default">{query}</span>&rdquo;
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="py-8 text-center text-xs text-kumo-subtle">
              Type keywords to search pages, sections, and tags.
            </div>
          )}

          {!loading &&
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.url}-${idx}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded cursor-pointer ${
                    isSelected ? "bg-kumo-tint text-kumo-strong" : "text-kumo-default"
                  }`}
                >
                  <span className="mt-0.5 text-kumo-subtle flex-shrink-0">
                    {item.type === "page" ? (
                      <FileText weight="thin" size={16} />
                    ) : item.type === "heading" ? (
                      <Hash weight="thin" size={16} />
                    ) : (
                      <Tag weight="thin" size={16} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{item.title}</span>
                      <span className="text-[11px] text-kumo-subtle px-1 rounded bg-kumo-control">
                        {item.docSpaceName}
                      </span>
                    </div>
                    {item.snippet && (
                      <div className="text-xs text-kumo-subtle truncate mt-0.5">
                        {item.snippet}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-kumo-hairline bg-kumo-recessed flex items-center justify-between text-[11px] text-kumo-subtle">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
            <span>Select: <kbd className="font-mono">↵</kbd></span>
          </div>
          <span>Internal Documentation Engine</span>
        </div>
      </div>
    </div>
  );
}
