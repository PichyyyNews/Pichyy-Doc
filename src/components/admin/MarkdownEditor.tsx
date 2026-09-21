"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DocPageItem, DocSpaceItem, TocItem } from "@/lib/types";
import { parseHeadingsFromMarkdown, parseImageSrc, splitMarkdownGalleries, GalleryImage } from "@/lib/markdown";
import { ImageSettingsModal } from "./ImageSettingsModal";
import { GallerySettingsModal } from "./GallerySettingsModal";
import { GalleryGrid } from "@/components/docs/GalleryGrid";
import { ImageLightbox } from "@/components/docs/ImageLightbox";
import {
  Check,
  FloppyDisk,
  ArrowSquareOut,
  Tag,
  ListBullets,
  Image as ImageIcon,
  Spinner,
  X,
  SlidersHorizontal,
  SquaresFour,
} from "@phosphor-icons/react";
import Link from "next/link";
import hljs from "highlight.js";

const PreContext = React.createContext(false);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface MarkdownEditorProps {
  page: DocPageItem;
  spaces: DocSpaceItem[];
  onSaveSuccess: (updatedPage: DocPageItem) => void;
}

export function MarkdownEditor({ page, spaces, onSaveSuccess }: MarkdownEditorProps) {
  const currentSpace = spaces.find((s) => s.id === page.docSpaceId);

  // Form states
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [description, setDescription] = useState(page.description || "");
  const [categoryId, setCategoryId] = useState(page.categoryId || "");
  const [content, setContent] = useState(page.content);
  const [order, setOrder] = useState(page.order);
  const [isPublished, setIsPublished] = useState(page.isPublished);

  // Search Keywords state
  const [keywords, setKeywords] = useState<string[]>(() => {
    try {
      return JSON.parse(page.searchKeywords || "[]");
    } catch {
      return [];
    }
  });
  const [keywordInput, setKeywordInput] = useState("");

  // TOC Anchors state
  const [tocItems, setTocItems] = useState<TocItem[]>(() => {
    try {
      const parsed = JSON.parse(page.tocAnchors || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
    return parseHeadingsFromMarkdown(page.content);
  });

  // Re-scan headings whenever content changes
  useEffect(() => {
    const detected = parseHeadingsFromMarkdown(content);
    setTocItems((prev) => {
      // preserve previous toggle state if heading ID exists
      return detected.map((det) => {
        const existing = prev.find((p) => p.id === det.id);
        return {
          ...det,
          enabled: existing ? existing.enabled : true,
        };
      });
    });
  }, [content]);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active view tab (Editor, Preview, Split)
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");

  // Image Upload Refs & States
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; alt?: string } | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [previewLightbox, setPreviewLightbox] = useState<{
    images: GalleryImage[];
    index: number;
  } | null>(null);

  const insertMarkdownAtCursor = (markdownTag: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        content.substring(0, start) + markdownTag + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + markdownTag.length;
      }, 50);
    } else {
      setContent((prev) => prev + markdownTag);
    }
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        const altText = file.name.replace(/\.[^/.]+$/, "") || "image";
        // Open the Image Settings Dialog so the user can configure border, width, alignment
        setModalImage({ url: json.url, alt: altText });
      } else {
        alert(json.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          uploadAndInsertImage(file);
          break;
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("image/")) {
          uploadAndInsertImage(files[i]);
          break;
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleToggleAnchor = (id: string) => {
    setTocItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const trimmed = keywordInput.trim().toLowerCase();
      if (!keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleSave = async () => {
    if (!title || !slug) return;
    setSaving(true);
    setToastMessage(null);

    try {
      const payload = {
        id: page.id,
        docSpaceId: page.docSpaceId,
        categoryId: categoryId || null,
        title,
        slug,
        description,
        content,
        tocAnchors: JSON.stringify(tocItems),
        searchKeywords: JSON.stringify(keywords),
        order: Number(order),
        isPublished,
      };

      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage("Page saved successfully!");
        onSaveSuccess(json.page);
        setTimeout(() => setToastMessage(null), 2500);
      } else {
        alert(json.error || "Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  const liveDocUrl = currentSpace ? `/docs/${currentSpace.slug}/${slug}` : "#";

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-kumo-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-kumo-subtle font-mono">
              {currentSpace?.name} /
            </span>
            <h2 className="text-lg font-semibold text-kumo-strong">{title || "Untitled"}</h2>
          </div>
          <p className="text-xs text-kumo-subtle mt-0.5 font-mono">
            URL: {liveDocUrl}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={liveDocUrl}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none"
          >
            <span>View live doc</span>
            <ArrowSquareOut weight="thin" size={13} />
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground transition-none disabled:opacity-50"
          >
            <FloppyDisk weight="thin" size={15} />
            <span>{saving ? "Saving..." : "Save changes"}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="px-3 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Check weight="thin" size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metadata Configuration */}
      <div className="p-4 rounded-lg border border-kumo-line bg-kumo-base space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-kumo-subtle mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-kumo-subtle mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-kumo-subtle mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
            >
              <option value="">(Root / Uncategorized)</option>
              {currentSpace?.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-kumo-subtle mb-1">
            Subtitle / Introduction (Shown below title)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief introduction or scope of this document..."
            className="w-full px-3 py-1.5 text-xs rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
          />
        </div>

        {/* Search Keywords Tagger */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-kumo-subtle mb-1.5">
            <Tag weight="thin" size={14} className="text-kumo-brand" />
            <span>Search Keywords & Tags (Indexed by Command Palette search)</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded border border-kumo-line bg-kumo-control">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-kumo-base border border-kumo-line text-kumo-default font-mono"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-kumo-subtle hover:text-kumo-default"
                >
                  <X weight="thin" size={11} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Type keyword & press Enter..."
              className="flex-1 min-w-[140px] bg-transparent text-xs text-kumo-default placeholder-kumo-subtle focus:outline-none"
            />
          </div>
        </div>

        {/* 'On This Page' Headings Anchor Manager */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-kumo-subtle">
              <ListBullets weight="thin" size={14} className="text-kumo-brand" />
              <span>&ldquo;On This Page&rdquo; TOC Anchors (Check to display in right sidebar)</span>
            </div>
            <span className="text-[11px] text-kumo-subtle">
              {tocItems.filter((t) => t.enabled).length} / {tocItems.length} active
            </span>
          </div>

          <div className="max-h-44 overflow-y-auto rounded border border-kumo-line bg-kumo-control p-2 divide-y divide-kumo-hairline">
            {tocItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center justify-between py-1.5 px-2 hover:bg-kumo-tint rounded cursor-pointer select-none text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => handleToggleAnchor(item.id)}
                    className="rounded border-kumo-line text-kumo-brand focus:ring-0"
                  />
                  <span
                    className={`truncate ${
                      item.level === 3 ? "pl-3 text-kumo-subtle text-[11px]" : "font-medium text-kumo-default"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-kumo-subtle ml-2 flex-shrink-0">
                  H{item.level} (#{item.id})
                </span>
              </label>
            ))}
            {tocItems.length === 0 && (
              <div className="py-3 text-center text-xs text-kumo-subtle">
                No H2 or H3 headings detected in markdown yet. Write ## or ### to create headings.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor View Mode & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-kumo-strong">Markdown Content</span>

          {/* Insert Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none select-none disabled:opacity-50"
            title="Insert image (supports File Dialog, Drag & Drop, or Paste Ctrl+V)"
          >
            {isUploadingImage ? (
              <Spinner weight="thin" size={14} className="animate-spin text-kumo-brand" />
            ) : (
              <ImageIcon weight="thin" size={14} />
            )}
            <span>{isUploadingImage ? "Uploading..." : "Insert image"}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadAndInsertImage(file);
                e.target.value = "";
              }
            }}
            accept="image/*"
            className="hidden"
          />

          {/* Custom Image / Layout Options Button */}
          <button
            type="button"
            onClick={() => setModalImage({ url: "", alt: "" })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none select-none"
            title="Configure image layout by URL (Borderless, Size, Alignment, Text Wrap)"
          >
            <SlidersHorizontal weight="thin" size={14} />
            <span>Image options</span>
          </button>

          {/* Insert Gallery / Album Button */}
          <button
            type="button"
            onClick={() => setIsGalleryModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none select-none"
            title="Insert Image Gallery / Album Grid (2-4 columns, uniform ratio, lightbox)"
          >
            <SquaresFour weight="thin" size={14} />
            <span>Insert gallery</span>
          </button>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded border border-kumo-line bg-kumo-control text-xs">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-2 py-1 rounded transition-none ${
              viewMode === "split" ? "bg-kumo-base font-medium shadow-xs" : "text-kumo-subtle hover:text-kumo-default"
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("editor")}
            className={`px-2 py-1 rounded transition-none ${
              viewMode === "editor" ? "bg-kumo-base font-medium shadow-xs" : "text-kumo-subtle hover:text-kumo-default"
            }`}
          >
            Editor Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-2 py-1 rounded transition-none ${
              viewMode === "preview" ? "bg-kumo-base font-medium shadow-xs" : "text-kumo-subtle hover:text-kumo-default"
            }`}
          >
            Preview Only
          </button>
        </div>
      </div>

      {/* Content Editor / Live Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[550px]">
        {/* Editor Area */}
        {(viewMode === "split" || viewMode === "editor") && (
          <div className={`relative h-full flex flex-col rounded-lg border bg-kumo-base overflow-hidden transition-none ${
            isDraggingOver ? "border-kumo-brand ring-2 ring-kumo-brand/20" : "border-kumo-line"
          } ${viewMode === "editor" ? "lg:col-span-2" : ""}`}>
            <div className="px-3 py-2 border-b border-kumo-hairline bg-kumo-recessed text-xs text-kumo-subtle font-mono flex items-center justify-between">
              <span>Markdown Source</span>
              <span>
                {isUploadingImage ? (
                  <span className="text-kumo-brand font-medium">Uploading image...</span>
                ) : isDraggingOver ? (
                  <span className="text-kumo-brand font-medium">Drop image file here...</span>
                ) : (
                  `${content.length} characters`
                )}
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              placeholder="Write markdown here... Tip: Drag & drop images or paste (Ctrl+V) screenshots directly into this editor..."
              className="flex-1 w-full p-4 bg-transparent text-xs font-mono leading-relaxed resize-none focus:outline-none text-kumo-default overflow-y-auto"
            />
          </div>
        )}


        {/* Live Preview Area */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className={`h-full flex flex-col rounded-lg border border-kumo-line bg-kumo-base overflow-hidden ${
            viewMode === "preview" ? "lg:col-span-2" : ""
          }`}>
            <div className="px-3 py-2 border-b border-kumo-hairline bg-kumo-recessed text-xs text-kumo-subtle font-mono">
              <span>Live Rendered Preview</span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto prose prose-sm dark:prose-invert max-w-none text-kumo-default text-xs leading-relaxed">
              {splitMarkdownGalleries(content).map((seg, sIdx) => {
                if (seg.type === "gallery" && seg.gallery) {
                  return (
                    <GalleryGrid
                      key={`preview-gallery-${sIdx}`}
                      block={seg.gallery}
                      onImageClick={(imgs, idx) =>
                        setPreviewLightbox({ images: imgs, index: idx })
                      }
                    />
                  );
                }

                return (
                  <ReactMarkdown
                    key={`preview-md-${sIdx}`}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-kumo-strong mt-6 mb-2 border-b border-kumo-hairline pb-1 clear-both">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold text-kumo-strong mt-4 mb-1.5 clear-both">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-sm font-semibold text-kumo-strong mt-0 mb-1.5">
                          {children}
                        </h4>
                      ),
                      hr: () => <hr className="my-5 border-kumo-line/60 clear-both" />,
                      p: ({ children }) => <div className="mb-3 text-kumo-default">{children}</div>,
                      pre: ({ children }: any) => (
                        <PreContext.Provider value={true}>
                          {children}
                        </PreContext.Provider>
                      ),
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                      code: ({ className, children }: any) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const isInsidePre = React.useContext(PreContext);
                        if (!isInsidePre) {
                          return (
                            <code className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-kumo-recessed border border-kumo-line text-kumo-strong font-normal">
                              {children}
                            </code>
                          );
                        }

                        const extractText = (node: any): string => {
                          if (typeof node === "string") return node;
                          if (typeof node === "number") return String(node);
                          if (Array.isArray(node)) return node.map(extractText).join("");
                          if (React.isValidElement(node)) return extractText((node.props as any)?.children);
                          return "";
                        };

                        const codeText = extractText(children).replace(/\n$/, "");
                        const match = /language-(\w+)/.exec(className || "");
                        const explicitLanguage = match ? match[1].toLowerCase() : "";

                        let highlightedHtml = "";
                        let displayLanguage = explicitLanguage;

                        if (explicitLanguage && hljs.getLanguage(explicitLanguage)) {
                          try {
                            const res = hljs.highlight(codeText, { language: explicitLanguage, ignoreIllegals: true });
                            highlightedHtml = res.value;
                            displayLanguage = explicitLanguage;
                          } catch {
                            highlightedHtml = escapeHtml(codeText);
                          }
                        } else if (!explicitLanguage && codeText.trim()) {
                          try {
                            const autoRes = hljs.highlightAuto(codeText);
                            highlightedHtml = autoRes.value;
                            displayLanguage = autoRes.language || "text";
                          } catch {
                            highlightedHtml = escapeHtml(codeText);
                            displayLanguage = "text";
                          }
                        } else {
                          highlightedHtml = escapeHtml(codeText);
                          displayLanguage = explicitLanguage || "text";
                        }

                        const lines = codeText.split("\n");
                        const showLineNumbers = lines.length > 1;

                        return (
                          <div className="my-3 rounded-lg border border-kumo-line bg-kumo-recessed overflow-hidden text-xs">
                            <div className="px-3 py-1 border-b border-kumo-hairline bg-kumo-base text-[10px] uppercase font-mono text-kumo-subtle font-semibold">
                              {displayLanguage}
                            </div>
                            <div className="flex font-mono leading-relaxed overflow-x-auto">
                              {showLineNumbers && (
                                <div
                                  className="select-none text-right pr-2.5 pl-2.5 py-2.5 text-[11px] font-mono text-kumo-subtle/40 border-r border-kumo-line/40 shrink-0 bg-kumo-base/30"
                                  aria-hidden="true"
                                >
                                  {lines.map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                  ))}
                                </div>
                              )}
                              <pre className="p-2.5 text-[11px] font-mono leading-relaxed overflow-x-auto text-kumo-default flex-1">
                                <code
                                  className="hljs"
                                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                                />
                              </pre>
                            </div>
                          </div>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-kumo-brand bg-kumo-recessed px-3 py-2 my-3 text-xs">
                          {children}
                        </blockquote>
                      ),
                      img: ({ src, alt }: any) => {
                        const opts = parseImageSrc(src);

                        let layoutClass = "";
                        if (opts.wrap && opts.align === "right") {
                          layoutClass = "float-right ml-4 mb-3 mt-0 max-w-full clear-none";
                        } else if (opts.wrap && opts.align === "left") {
                          layoutClass = "float-left mr-4 mb-3 mt-0 max-w-full clear-none";
                        } else {
                          const alignClass =
                            opts.align === "center"
                              ? "mx-auto"
                              : opts.align === "right"
                              ? "ml-auto mr-0"
                              : "mr-auto ml-0";
                          layoutClass = `my-4 ${alignClass}`;
                        }

                        return (
                          <figure
                            className={layoutClass}
                            style={{ width: opts.width, maxWidth: "100%" }}
                          >
                            <div
                              className={`overflow-hidden ${
                                opts.hasBorder
                                  ? "rounded-lg border border-kumo-line bg-kumo-base"
                                  : ""
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewLightbox({
                                    images: [{ src: opts.cleanSrc, alt: alt || "" }],
                                    index: 0,
                                  })
                                }
                                className="w-full block text-left cursor-zoom-in"
                                title="Click to preview image"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={opts.cleanSrc}
                                  alt={alt || ""}
                                  className="w-full h-auto object-contain max-h-80 block"
                                />
                              </button>
                              {opts.hasBorder && alt && (
                                <div className="px-3 py-1.5 text-[11px] text-kumo-subtle border-t border-kumo-hairline bg-kumo-control">
                                  {alt}
                                </div>
                              )}
                            </div>
                            {!opts.hasBorder && alt && (
                              <figcaption className="text-center text-[11px] text-kumo-subtle mt-1">
                                {alt}
                              </figcaption>
                            )}
                          </figure>
                        );
                      },
                    }}
                  >
                    {seg.content || ""}
                  </ReactMarkdown>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Image Settings Dialog */}
      {modalImage && (
        <ImageSettingsModal
          open={!!modalImage}
          onClose={() => setModalImage(null)}
          imageUrl={modalImage.url}
          initialAlt={modalImage.alt}
          onConfirm={(markdownTag) => {
            insertMarkdownAtCursor(markdownTag);
            setModalImage(null);
          }}
        />
      )}

      {/* Gallery / Album Settings Dialog */}
      {isGalleryModalOpen && (
        <GallerySettingsModal
          open={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
          onConfirm={(galleryBlock) => {
            insertMarkdownAtCursor(galleryBlock);
            setIsGalleryModalOpen(false);
          }}
        />
      )}

      {/* Lightbox Preview in Admin */}
      {previewLightbox && (
        <ImageLightbox
          images={previewLightbox.images}
          currentIndex={previewLightbox.index}
          onClose={() => setPreviewLightbox(null)}
          onNavigate={(newIdx) =>
            setPreviewLightbox((prev) => (prev ? { ...prev, index: newIdx } : null))
          }
        />
      )}
    </div>
  );
}

