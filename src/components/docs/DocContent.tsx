"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyPageDropdown } from "./CopyPageDropdown";
import { DocPageItem, DocSpaceItem, TocItem } from "@/lib/types";
import { parseImageSrc, splitMarkdownGalleries, GalleryImage } from "@/lib/markdown";
import { GalleryGrid } from "./GalleryGrid";
import { ImageLightbox } from "./ImageLightbox";
import { ArrowLeft, ArrowRight, Check, Copy } from "@phosphor-icons/react";

interface DocContentProps {
  space: DocSpaceItem;
  page: DocPageItem;
  tocAnchors: TocItem[];
  sidebarCollapsed?: boolean;
  tocCollapsed?: boolean;
}

// Code Block with Copy Button
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group my-4 rounded-lg border border-kumo-line bg-kumo-recessed overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-kumo-hairline bg-kumo-base text-[11px] text-kumo-subtle font-mono">
        <span>{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-kumo-tint text-kumo-subtle hover:text-kumo-default transition-none"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check weight="thin" size={12} className="text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy weight="thin" size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-kumo-default">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function DocContent({
  space,
  page,
  tocAnchors,
  sidebarCollapsed = false,
  tocCollapsed = false,
}: DocContentProps) {
  // Compute dynamic reading max-width based on sidebar collapse states
  let maxWidthClass = "max-w-3xl";
  if (sidebarCollapsed && tocCollapsed) {
    maxWidthClass = "max-w-5xl";
  } else if (sidebarCollapsed || tocCollapsed) {
    maxWidthClass = "max-w-4xl";
  }

  // Find Previous and Next pages in this doc space
  const allPages = space.pages.filter((p) => p.isPublished);
  const currentIndex = allPages.findIndex((p) => p.slug === page.slug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  // Track heading ID indices
  let headingCounter = 0;

  // Gallery Lightbox State
  const [lightboxState, setLightboxState] = useState<{
    images: GalleryImage[];
    index: number;
  } | null>(null);

  const segments = splitMarkdownGalleries(page.content);

  const markdownComponents = {
    h1: ({ children }: any) => (
      <h2 className="text-2xl font-semibold text-kumo-strong mt-8 mb-4 clear-both">
        {children}
      </h2>
    ),
    h2: ({ children }: any) => {
      const anchor = tocAnchors[headingCounter++];
      const id = anchor?.id;
      return (
        <h2
          id={id}
          className="text-lg sm:text-xl font-semibold text-kumo-strong mt-8 mb-3 scroll-mt-28 group flex items-center gap-2 clear-both"
        >
          <span>{children}</span>
          {id && (
            <a
              href={`#${id}`}
              className="opacity-0 group-hover:opacity-100 text-kumo-subtle hover:text-kumo-brand text-sm transition-none"
              aria-label={`Link to ${String(children)}`}
            >
              #
            </a>
          )}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const anchor = tocAnchors[headingCounter++];
      const id = anchor?.id;
      return (
        <h3
          id={id}
          className="text-sm sm:text-base font-semibold text-kumo-strong mt-6 mb-2 scroll-mt-28 group flex items-center gap-2 clear-both"
        >
          <span>{children}</span>
          {id && (
            <a
              href={`#${id}`}
              className="opacity-0 group-hover:opacity-100 text-kumo-subtle hover:text-kumo-brand text-xs transition-none"
              aria-label={`Link to ${String(children)}`}
            >
              #
            </a>
          )}
        </h3>
      );
    },
    hr: () => <hr className="my-8 border-kumo-line clear-both" />,
    p: ({ children }: any) => (
      <p className="text-sm leading-relaxed mb-4 text-kumo-default">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-5 mb-4 text-sm space-y-1.5 text-kumo-default">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-5 mb-4 text-sm space-y-1.5 text-kumo-default">
        {children}
      </ol>
    ),
    li: ({ children }: any) => <li className="text-sm">{children}</li>,
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code
            className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-kumo-recessed border border-kumo-line text-kumo-strong"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <CodeBlock className={className}>{children}</CodeBlock>;
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-kumo-brand bg-kumo-recessed px-4 py-2.5 my-4 rounded-r-md text-sm text-kumo-default">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-kumo-line bg-kumo-base clear-both">
        <table className="w-full text-left border-collapse text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="border-b border-kumo-line bg-kumo-recessed text-kumo-strong font-semibold">
        {children}
      </thead>
    ),
    th: ({ children }: any) => <th className="px-4 py-2 font-medium">{children}</th>,
    td: ({ children }: any) => (
      <td className="px-4 py-2 border-t border-kumo-hairline text-kumo-default">
        {children}
      </td>
    ),
    img: ({ src, alt }: any) => {
      const opts = parseImageSrc(src);

      let layoutClass = "";
      if (opts.wrap && opts.align === "right") {
        layoutClass = "float-none md:float-right md:ml-6 mb-4 my-2 max-w-full clear-none";
      } else if (opts.wrap && opts.align === "left") {
        layoutClass = "float-none md:float-left md:mr-6 mb-4 my-2 max-w-full clear-none";
      } else {
        const alignClass =
          opts.align === "center"
            ? "mx-auto"
            : opts.align === "right"
            ? "ml-auto mr-0"
            : "mr-auto ml-0";
        layoutClass = `my-6 ${alignClass}`;
      }

      return (
        <figure
          className={layoutClass}
          style={{ width: opts.width, maxWidth: "100%" }}
        >
          <div
            className={`overflow-hidden ${
              opts.hasBorder
                ? "rounded-lg border border-kumo-line bg-kumo-base shadow-xs"
                : ""
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setLightboxState({
                  images: [{ src: opts.cleanSrc, alt: alt || "" }],
                  index: 0,
                })
              }
              className={`w-full block text-left cursor-zoom-in group ${
                opts.hasBorder ? "bg-kumo-control/30" : ""
              }`}
              title="Click to zoom image"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opts.cleanSrc}
                alt={alt || ""}
                className="w-full h-auto object-contain max-h-[520px] group-hover:opacity-95 transition-opacity block rounded"
                loading="lazy"
              />
            </button>
            {opts.hasBorder && alt && (
              <figcaption className="px-4 py-2 text-xs text-kumo-subtle border-t border-kumo-hairline bg-kumo-control flex items-center justify-between">
                <span>{alt}</span>
                <span className="text-[10px] uppercase font-mono text-kumo-subtle">
                  Click to zoom
                </span>
              </figcaption>
            )}
          </div>
          {!opts.hasBorder && alt && (
            <figcaption className="mt-2 text-center text-xs text-kumo-subtle">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
  };

  const currentCategory = space.categories.find((c) => c.id === page.categoryId);

  return (
    <article
      className={`flex-1 min-w-0 ${maxWidthClass} transition-all duration-200 px-4 sm:px-8 lg:px-10 py-5 sm:py-8`}
    >
      {/* Mobile-Friendly Breadcrumb Trail */}
      <nav
        className="flex items-center gap-1.5 text-xs text-kumo-subtle mb-3 select-none flex-wrap"
        aria-label="Breadcrumb navigation"
      >
        <Link
          href={`/docs/${space.slug}/${space.pages[0]?.slug || "overview"}`}
          className="hover:text-kumo-strong transition-none"
        >
          {space.name}
        </Link>
        {currentCategory && (
          <>
            <span className="text-kumo-hairline">/</span>
            <span className="text-kumo-subtle">{currentCategory.name}</span>
          </>
        )}
        <span className="text-kumo-hairline">/</span>
        <span className="text-kumo-strong font-medium truncate max-w-[180px] sm:max-w-none">
          {page.title}
        </span>
      </nav>

      {/* Page Header (Title + Responsive Copy button) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-normal text-kumo-strong break-words">
          {page.title}
        </h1>
        <div className="shrink-0 self-start sm:self-auto sm:pt-1">
          <CopyPageDropdown title={page.title} markdownContent={page.content} />
        </div>
      </div>

      {/* Description / Subtitle */}
      {page.description && (
        <p className="text-sm text-kumo-subtle leading-relaxed mb-8">
          {page.description}
        </p>
      )}

      {/* Hairline Divider */}
      <div className="border-b border-kumo-hairline mb-8" />

      {/* Markdown Content Area */}
      <div className="prose prose-sm dark:prose-invert max-w-none text-kumo-default text-sm">
        {segments.map((seg, sIdx) => {
          if (seg.type === "gallery" && seg.gallery) {
            return (
              <GalleryGrid
                key={`gallery-${sIdx}`}
                block={seg.gallery}
                onImageClick={(imgs, idx) =>
                  setLightboxState({ images: imgs, index: idx })
                }
              />
            );
          }
          return (
            <ReactMarkdown
              key={`md-${sIdx}`}
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {seg.content || ""}
            </ReactMarkdown>
          );
        })}
      </div>

      {/* Bottom Pagination Links */}
      <div className="mt-14 pt-6 border-t border-kumo-hairline flex items-center justify-between gap-4">
        {prevPage ? (
          <Link
            href={`/docs/${space.slug}/${prevPage.slug}`}
            className="flex items-center gap-2 text-xs text-kumo-subtle hover:text-kumo-brand transition-none"
          >
            <ArrowLeft weight="thin" size={14} className="shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-mono text-kumo-subtle">Previous</div>
              <div className="font-medium text-sm text-kumo-default">{prevPage.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPage && (
          <Link
            href={`/docs/${space.slug}/${nextPage.slug}`}
            className="ml-auto flex items-center gap-2 text-xs text-kumo-subtle hover:text-kumo-brand text-right transition-none"
          >
            <div>
              <div className="text-[10px] uppercase font-mono text-kumo-subtle">Next</div>
              <div className="font-medium text-sm text-kumo-default">{nextPage.title}</div>
            </div>
            <ArrowRight weight="thin" size={14} className="shrink-0" />
          </Link>
        )}
      </div>

      {/* Gallery Lightbox Modal */}
      {lightboxState && (
        <ImageLightbox
          images={lightboxState.images}
          currentIndex={lightboxState.index}
          onClose={() => setLightboxState(null)}
          onNavigate={(newIdx) =>
            setLightboxState((prev) => (prev ? { ...prev, index: newIdx } : null))
          }
        />
      )}
    </article>
  );
}

