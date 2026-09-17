"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { DocSpacesManager } from "@/components/admin/DocSpacesManager";
import { HierarchyManager } from "@/components/admin/HierarchyManager";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { DocPageItem, DocSpaceItem } from "@/lib/types";
import { BookOpen, TreeStructure, NotePencil, Spinner } from "@phosphor-icons/react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [spaces, setSpaces] = useState<DocSpaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: "editor" | "spaces" | "hierarchy"
  const [activeTab, setActiveTab] = useState<"editor" | "spaces" | "hierarchy">("editor");

  // Selection states for Editor
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");
  const [selectedPage, setSelectedPage] = useState<DocPageItem | null>(null);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth");
        const json = await res.json();
        if (!json.authenticated) {
          router.push("/admin/login");
        } else {
          setAuthenticated(true);
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  // Load documentation spaces
  const loadSpaces = async () => {
    try {
      const res = await fetch("/api/docs");
      const json = await res.json();
      if (json.success && json.spaces) {
        setSpaces(json.spaces);
        if (json.spaces.length > 0) {
          if (!selectedSpaceId) {
            setSelectedSpaceId(json.spaces[0].id);
          }
          if (!selectedPage) {
            const firstPage = json.spaces[0].pages[0] || null;
            setSelectedPage(firstPage);
          } else {
            // Update selectedPage reference if exists
            for (const sp of json.spaces) {
              const matched = sp.pages.find((p: DocPageItem) => p.id === selectedPage.id);
              if (matched) {
                setSelectedPage(matched);
                break;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to load spaces:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadSpaces();
    }
  }, [authenticated]);

  if (authenticated === null || loading) {
    return (
      <div className="min-h-screen bg-kumo-canvas flex items-center justify-center text-kumo-subtle">
        <div className="flex items-center gap-2 text-xs">
          <Spinner weight="thin" size={20} className="animate-spin text-kumo-brand" />
          <span>Loading admin console...</span>
        </div>
      </div>
    );
  }

  const currentSpace = spaces.find((s) => s.id === selectedSpaceId) || spaces[0];

  return (
    <div className="min-h-screen bg-kumo-canvas text-kumo-default">
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs (Kumo Tabs Pattern) */}
        <div className="flex items-center border-b border-kumo-line mb-8 gap-1">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-none ${
              activeTab === "editor"
                ? "border-kumo-brand text-kumo-brand font-semibold"
                : "border-transparent text-kumo-subtle hover:text-kumo-default"
            }`}
          >
            <NotePencil weight="thin" size={16} />
            <span>Content Editor</span>
          </button>

          <button
            onClick={() => setActiveTab("hierarchy")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-none ${
              activeTab === "hierarchy"
                ? "border-kumo-brand text-kumo-brand font-semibold"
                : "border-transparent text-kumo-subtle hover:text-kumo-default"
            }`}
          >
            <TreeStructure weight="thin" size={16} />
            <span>Sidebar & Categories</span>
          </button>

          <button
            onClick={() => setActiveTab("spaces")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-none ${
              activeTab === "spaces"
                ? "border-kumo-brand text-kumo-brand font-semibold"
                : "border-transparent text-kumo-subtle hover:text-kumo-default"
            }`}
          >
            <BookOpen weight="thin" size={16} />
            <span>Navbar & Spaces</span>
          </button>
        </div>

        {/* Tab 1: Content Editor */}
        {activeTab === "editor" && (
          <div>
            {/* Quick Page Picker when in Editor */}
            <div className="flex flex-wrap items-center gap-3 p-3 mb-6 rounded-lg border border-kumo-line bg-kumo-base">
              <div className="flex items-center gap-2">
                <span className="text-xs text-kumo-subtle font-medium">Doc Space:</span>
                <select
                  value={currentSpace?.id || ""}
                  onChange={(e) => {
                    setSelectedSpaceId(e.target.value);
                    const targetSpace = spaces.find((s) => s.id === e.target.value);
                    if (targetSpace && targetSpace.pages.length > 0) {
                      setSelectedPage(targetSpace.pages[0]);
                    } else {
                      setSelectedPage(null);
                    }
                  }}
                  className="px-2 py-1 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default font-medium focus:outline-none focus:border-kumo-brand"
                >
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-kumo-subtle font-medium">Editing Page:</span>
                <select
                  value={selectedPage?.id || ""}
                  onChange={(e) => {
                    const p = currentSpace?.pages.find((page) => page.id === e.target.value);
                    if (p) setSelectedPage(p);
                  }}
                  className="px-2 py-1 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default font-medium focus:outline-none focus:border-kumo-brand"
                >
                  {currentSpace?.pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                  {(!currentSpace?.pages || currentSpace.pages.length === 0) && (
                    <option value="">No pages available</option>
                  )}
                </select>
              </div>

              <button
                onClick={() => setActiveTab("hierarchy")}
                className="text-xs text-kumo-brand hover:underline ml-auto"
              >
                + Create new page in Sidebar & Categories
              </button>
            </div>

            {selectedPage ? (
              <MarkdownEditor
                key={selectedPage.id}
                page={selectedPage}
                spaces={spaces}
                onSaveSuccess={(updated) => {
                  setSelectedPage(updated);
                  loadSpaces();
                }}
              />
            ) : (
              <div className="py-16 text-center text-xs text-kumo-subtle rounded-lg border border-kumo-line bg-kumo-base">
                No page selected. Please select or create a page to begin editing.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Hierarchy & Sidebar */}
        {activeTab === "hierarchy" && (
          <HierarchyManager
            spaces={spaces}
            selectedSpaceId={selectedSpaceId}
            onSelectSpace={(id) => setSelectedSpaceId(id)}
            onSelectPageToEdit={(page) => {
              setSelectedPage(page);
              setSelectedSpaceId(page.docSpaceId);
              setActiveTab("editor");
            }}
            onRefresh={loadSpaces}
          />
        )}

        {/* Tab 3: Doc Spaces */}
        {activeTab === "spaces" && (
          <DocSpacesManager spaces={spaces} onRefresh={loadSpaces} />
        )}
      </div>
    </div>
  );
}
