"use client";

import React from "react";
import { GalleryBlock, GalleryImage } from "@/lib/markdown";
import { MagnifyingGlassPlus } from "@phosphor-icons/react";

interface GalleryGridProps {
  block: GalleryBlock;
  onImageClick: (images: GalleryImage[], initialIndex: number) => void;
}

export function GalleryGrid({ block, onImageClick }: GalleryGridProps) {
  const { cols, ratio, hasBorder, images } = block;

  // Responsive Grid column classes
  const gridColClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 4
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"; // default 3 cols

  // Tile aspect ratio classes
  const ratioClass =
    ratio === "16:9"
      ? "aspect-video object-cover"
      : ratio === "4:3"
      ? "aspect-[4/3] object-cover"
      : ratio === "1:1"
      ? "aspect-square object-cover"
      : "h-auto max-h-60 object-contain"; // natural

  return (
    <div className="my-6 clear-both">
      <div className={`grid ${gridColClass} gap-3 sm:gap-4`}>
        {images.map((img, idx) => (
          <div
            key={`${img.src}-${idx}`}
            className={`group flex flex-col ${
              hasBorder
                ? "rounded-lg border border-kumo-line bg-kumo-base shadow-xs overflow-hidden transition-colors hover:border-kumo-brand"
                : "rounded overflow-hidden"
            }`}
          >
            <button
              type="button"
              onClick={() => onImageClick(images, idx)}
              className="relative w-full block overflow-hidden bg-kumo-recessed cursor-zoom-in text-left focus:outline-none"
              title={img.alt || `Gallery image ${idx + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt || ""}
                className={`w-full ${ratioClass} transition-transform duration-200 group-hover:scale-[1.02] block`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                  <MagnifyingGlassPlus weight="thin" size={16} />
                </span>
              </div>
            </button>

            {img.alt && (
              <div
                className={`px-3 py-1.5 text-[11px] text-kumo-subtle truncate ${
                  hasBorder ? "border-t border-kumo-hairline bg-kumo-control/50" : "mt-1 text-center"
                }`}
                title={img.alt}
              >
                {img.alt}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
