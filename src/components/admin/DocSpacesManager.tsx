"use client";

import React, { useState } from "react";
import { DocSpaceItem } from "@/lib/types";
import { Plus, Trash, PencilSimple, Check, X } from "@phosphor-icons/react";

interface DocSpacesManagerProps {
  spaces: DocSpaceItem[];
  onRefresh: () => void;
}

export function DocSpacesManager({ spaces, onRefresh }: DocSpacesManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setOrder(spaces.length + 1);
    setIsDefault(false);
  };

  const startEdit = (space: DocSpaceItem) => {
    setEditingId(space.id);
    setIsCreating(false);
    setName(space.name);
    setSlug(space.slug);
    setDescription(space.description || "");
    setOrder(space.order);
    setIsDefault(space.isDefault);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          name,
          slug,
          description,
          order: Number(order),
          isDefault,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsCreating(false);
        setEditingId(null);
        onRefresh();
      } else {
        alert(json.error || "Failed to save doc space");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving doc space");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, spaceName: string) => {
    if (!confirm(`Are you sure you want to delete doc space "${spaceName}"? All categories and pages inside will be removed.`)) return;

    try {
      const res = await fetch(`/api/admin/docs?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        onRefresh();
      } else {
        alert(json.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting doc space");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-kumo-strong">Navbar & Doc Spaces</h2>
          <p className="text-xs text-kumo-subtle mt-0.5">
            Manage documentation spaces displayed in the top navbar menu.
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground transition-none"
          >
            <Plus weight="thin" size={14} />
            <span>Add doc space</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSave} className="p-4 rounded-lg border border-kumo-line bg-kumo-base space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-kumo-hairline">
            <h3 className="text-xs font-semibold text-kumo-strong">
              {editingId ? "Edit doc space" : "Create new doc space"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="text-kumo-subtle hover:text-kumo-default p-1"
            >
              <X weight="thin" size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (isCreating) {
                    setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"));
                  }
                }}
                required
                placeholder="e.g. Developer Docs"
                className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kumo-subtle mb-1">Slug (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="e.g. dev-docs"
                className="w-full px-3 py-1.5 text-xs font-mono rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-kumo-subtle mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of this documentation area..."
              className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs text-kumo-subtle">Order:</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default font-mono"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-kumo-default cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-kumo-line text-kumo-brand focus:ring-0"
              />
              <span>Set as default space (loads first)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 text-xs rounded border border-kumo-line hover:bg-kumo-tint text-kumo-default transition-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground transition-none"
            >
              <Check weight="thin" size={14} />
              <span>{loading ? "Saving..." : "Save doc space"}</span>
            </button>
          </div>
        </form>
      )}

      {/* High-density Table */}
      <div className="rounded-lg border border-kumo-line bg-kumo-base overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-kumo-line bg-kumo-recessed text-kumo-strong font-medium">
              <th className="py-2.5 px-4">Order</th>
              <th className="py-2.5 px-4">Name</th>
              <th className="py-2.5 px-4">Slug</th>
              <th className="py-2.5 px-4">Categories / Pages</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id} className="border-b border-kumo-hairline hover:bg-kumo-tint transition-none">
                <td className="py-2.5 px-4 font-mono text-kumo-subtle">{space.order}</td>
                <td className="py-2.5 px-4 font-medium text-kumo-strong">{space.name}</td>
                <td className="py-2.5 px-4 font-mono text-kumo-subtle">{space.slug}</td>
                <td className="py-2.5 px-4 text-kumo-subtle">
                  {space.categories.length} categories, {space.pages.length} pages
                </td>
                <td className="py-2.5 px-4">
                  {space.isDefault && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                      Default
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(space)}
                      className="p-1 text-kumo-subtle hover:text-kumo-default rounded hover:bg-kumo-tint"
                      title="Edit"
                    >
                      <PencilSimple weight="thin" size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(space.id, space.name)}
                      className="p-1 text-kumo-subtle hover:text-red-500 rounded hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash weight="thin" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {spaces.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-kumo-subtle">
                  No doc spaces created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
