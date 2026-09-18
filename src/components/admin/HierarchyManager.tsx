"use client";

import React, { useState } from "react";
import { DocSpaceItem, CategoryItem, DocPageItem } from "@/lib/types";
import { Plus, Trash, PencilSimple, FileText, Folder, Check, X, ArrowSquareOut } from "@phosphor-icons/react";
import Link from "next/link";

interface HierarchyManagerProps {
  spaces: DocSpaceItem[];
  selectedSpaceId: string;
  onSelectSpace: (id: string) => void;
  onSelectPageToEdit: (page: DocPageItem) => void;
  onRefresh: () => void;
}

export function HierarchyManager({
  spaces,
  selectedSpaceId,
  onSelectSpace,
  onSelectPageToEdit,
  onRefresh,
}: HierarchyManagerProps) {
  const currentSpace = spaces.find((s) => s.id === selectedSpaceId) || spaces[0];

  // Category creation state
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catOrder, setCatOrder] = useState(1);

  // Page creation state
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageDesc, setPageDesc] = useState("");
  const [pageCatId, setPageCatId] = useState<string>("");
  const [pageOrder, setPageOrder] = useState(1);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug || !currentSpace) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docSpaceId: currentSpace.id,
          name: catName,
          slug: catSlug,
          order: Number(catOrder),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsCreatingCat(false);
        setCatName("");
        setCatSlug("");
        onRefresh();
      } else {
        alert(json.error || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving category");
    }
  };

  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Pages inside will become root pages.`)) return;

    try {
      const res = await fetch(`/api/admin/categories?docSpaceId=${currentSpace.id}&categoryId=${catId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) onRefresh();
      else alert(json.error || "Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle || !pageSlug || !currentSpace) return;

    try {
      const initialContent = `# ${pageTitle}\n\nWrite documentation content here.\n\n## Section 1\nDetails for section 1.`;
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docSpaceId: currentSpace.id,
          categoryId: pageCatId || null,
          title: pageTitle,
          slug: pageSlug,
          description: pageDesc,
          content: initialContent,
          order: Number(pageOrder),
          isPublished: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsCreatingPage(false);
        setPageTitle("");
        setPageSlug("");
        setPageDesc("");
        onRefresh();
        onSelectPageToEdit(json.page);
      } else {
        alert(json.error || "Failed to create page");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving page");
    }
  };

  const handleDeletePage = async (pageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete page "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/pages?docSpaceId=${currentSpace.id}&pageId=${pageId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) onRefresh();
      else alert(json.error || "Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Error deleting page");
    }
  };

  if (!currentSpace) {
    return (
      <div className="py-12 text-center text-xs text-kumo-subtle">
        Please create a Doc Space first.
      </div>
    );
  }

  const rootPages = currentSpace.pages.filter((p) => !p.categoryId);

  return (
    <div className="space-y-6">
      {/* Header with Doc Space Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-kumo-strong">Sidebar & Page Hierarchy</h2>
          <p className="text-xs text-kumo-subtle mt-0.5">
            Organize categories and pages for the left sidebar navigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-kumo-subtle">Active Space:</label>
          <select
            value={currentSpace.id}
            onChange={(e) => onSelectSpace(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand font-medium"
          >
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsCreatingCat(true);
            setIsCreatingPage(false);
            setCatOrder(currentSpace.categories.length + 1);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none"
        >
          <Folder weight="thin" size={14} />
          <span>Add category</span>
        </button>

        <button
          onClick={() => {
            setIsCreatingPage(true);
            setIsCreatingCat(false);
            setPageOrder(currentSpace.pages.length + 1);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground transition-none"
        >
          <Plus weight="thin" size={14} />
          <span>Add new page</span>
        </button>
      </div>

      {/* Add Category Form */}
      {isCreatingCat && (
        <form onSubmit={handleSaveCategory} className="p-4 rounded-lg border border-kumo-line bg-kumo-base space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-kumo-hairline">
            <h3 className="text-xs font-semibold text-kumo-strong">Create category</h3>
            <button type="button" onClick={() => setIsCreatingCat(false)} className="text-kumo-subtle hover:text-kumo-default">
              <X weight="thin" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Category Name</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => {
                  setCatName(e.target.value);
                  setCatSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"));
                }}
                required
                placeholder="e.g. Components"
                className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Slug</label>
              <input
                type="text"
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                required
                placeholder="e.g. components"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Order</label>
              <input
                type="number"
                value={catOrder}
                onChange={(e) => setCatOrder(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingCat(false)}
              className="px-3 py-1.5 text-xs rounded border border-kumo-line hover:bg-kumo-tint text-kumo-default"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground"
            >
              <Check weight="thin" size={14} />
              <span>Create category</span>
            </button>
          </div>
        </form>
      )}

      {/* Add Page Form */}
      {isCreatingPage && (
        <form onSubmit={handleSavePage} className="p-4 rounded-lg border border-kumo-line bg-kumo-base space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-kumo-hairline">
            <h3 className="text-xs font-semibold text-kumo-strong">Create documentation page</h3>
            <button type="button" onClick={() => setIsCreatingPage(false)} className="text-kumo-subtle hover:text-kumo-default">
              <X weight="thin" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Page Title</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => {
                  setPageTitle(e.target.value);
                  setPageSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"));
                }}
                required
                placeholder="e.g. Installation & Setup"
                className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Page Slug (URL)</label>
              <input
                type="text"
                value={pageSlug}
                onChange={(e) => setPageSlug(e.target.value)}
                required
                placeholder="e.g. installation"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Category</label>
              <select
                value={pageCatId}
                onChange={(e) => setPageCatId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              >
                <option value="">(Root / Uncategorized)</option>
                {currentSpace.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Order</label>
              <input
                type="number"
                value={pageOrder}
                onChange={(e) => setPageOrder(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kumo-subtle mb-1">Subtitle / Description</label>
            <input
              type="text"
              value={pageDesc}
              onChange={(e) => setPageDesc(e.target.value)}
              placeholder="Brief summary shown at the top of the page..."
              className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingPage(false)}
              className="px-3 py-1.5 text-xs rounded border border-kumo-line hover:bg-kumo-tint text-kumo-default"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground"
            >
              <Check weight="thin" size={14} />
              <span>Create & edit page</span>
            </button>
          </div>
        </form>
      )}

      {/* Structure Tree View */}
      <div className="space-y-4">
        {/* Root Pages Section */}
        <div className="rounded-lg border border-kumo-line bg-kumo-base p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText weight="thin" size={16} className="text-kumo-subtle" />
              <span className="text-xs font-semibold text-kumo-strong">Root / Direct Pages</span>
            </div>
            <span className="text-[11px] text-kumo-subtle">{rootPages.length} pages</span>
          </div>

          <div className="divide-y divide-kumo-hairline">
            {rootPages.map((page) => (
              <div key={page.id} className="py-2.5 flex items-center justify-between hover:bg-kumo-tint px-2 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-kumo-subtle font-mono w-4">{page.order}</span>
                  <div>
                    <span className="text-xs font-medium text-kumo-strong">{page.title}</span>
                    <span className="ml-2 text-[11px] font-mono text-kumo-subtle">/{page.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPageToEdit(page)}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-kumo-line bg-kumo-control hover:bg-kumo-tint text-kumo-default transition-none"
                  >
                    <PencilSimple weight="thin" size={13} />
                    <span>Edit Content</span>
                  </button>
                  <Link
                    href={`/docs/${currentSpace.slug}/${page.slug}`}
                    target="_blank"
                    className="p-1 text-kumo-subtle hover:text-kumo-default rounded hover:bg-kumo-tint"
                    title="View Public Page"
                  >
                    <ArrowSquareOut weight="thin" size={14} />
                  </Link>
                  <button
                    onClick={() => handleDeletePage(page.id, page.title)}
                    className="p-1 text-kumo-subtle hover:text-red-500 rounded hover:bg-red-500/10"
                    title="Delete page"
                  >
                    <Trash weight="thin" size={14} />
                  </button>
                </div>
              </div>
            ))}
            {rootPages.length === 0 && (
              <div className="py-3 text-center text-xs text-kumo-subtle">No root pages.</div>
            )}
          </div>
        </div>

        {/* Categorized Sections */}
        {currentSpace.categories.map((cat) => {
          const catPages = currentSpace.pages.filter((p) => p.categoryId === cat.id);

          return (
            <div key={cat.id} className="rounded-lg border border-kumo-line bg-kumo-base p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-kumo-hairline">
                <div className="flex items-center gap-2">
                  <Folder weight="thin" size={16} className="text-kumo-brand" />
                  <span className="text-xs font-semibold text-kumo-strong">{cat.name}</span>
                  <span className="text-[11px] font-mono text-kumo-subtle">/{cat.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-kumo-subtle">{catPages.length} pages</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1 text-kumo-subtle hover:text-red-500 rounded hover:bg-red-500/10"
                    title="Delete category"
                  >
                    <Trash weight="thin" size={13} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-kumo-hairline">
                {catPages.map((page) => (
                  <div key={page.id} className="py-2.5 flex items-center justify-between hover:bg-kumo-tint px-2 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-kumo-subtle font-mono w-4">{page.order}</span>
                      <div>
                        <span className="text-xs font-medium text-kumo-strong">{page.title}</span>
                        <span className="ml-2 text-[11px] font-mono text-kumo-subtle">/{page.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPageToEdit(page)}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-kumo-line bg-kumo-control hover:bg-kumo-tint text-kumo-default transition-none"
                      >
                        <PencilSimple weight="thin" size={13} />
                        <span>Edit Content</span>
                      </button>
                      <Link
                        href={`/docs/${currentSpace.slug}/${page.slug}`}
                        target="_blank"
                        className="p-1 text-kumo-subtle hover:text-kumo-default rounded hover:bg-kumo-tint"
                        title="View Public Page"
                      >
                        <ArrowSquareOut weight="thin" size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeletePage(page.id, page.title)}
                        className="p-1 text-kumo-subtle hover:text-red-500 rounded hover:bg-red-500/10"
                        title="Delete page"
                      >
                        <Trash weight="thin" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {catPages.length === 0 && (
                  <div className="py-3 text-center text-xs text-kumo-subtle">
                    No pages in this category. Click &quot;Add new page&quot; to add one.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
