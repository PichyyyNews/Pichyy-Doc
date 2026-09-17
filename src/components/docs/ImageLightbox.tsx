"use client";

import React, { useEffect } from "react";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { GalleryImage } from "@/lib/markdown";

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const currentImage = images[currentIndex];
  const total = images.length;
  const hasMultiple = total > 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        onNavigate((currentIndex - 1 + total) % total);
      } else if (e.key === "ArrowRight" && hasMultiple) {
        onNavigate((currentIndex + 1) % total);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, total, hasMultiple, onClose, onNavigate]);

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-4 inset-x-4 flex items-center justify-between text-white/90 z-20 pointer-events-none"
      >
        <div className="pointer-events-auto bg-black/50 px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono">
          {hasMultiple ? (
            <span>
              {currentIndex + 1} / {total}
            </span>
          ) : (
            <span>Image Preview</span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white transition-none"
          title="Close (Esc)"
        >
          <X weight="thin" size={20} />
        </button>
      </div>

      {/* Prev Button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex - 1 + total) % total);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white transition-none focus:outline-none"
          title="Previous (Left Arrow)"
        >
          <CaretLeft weight="thin" size={24} />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.src}
          alt={currentImage.alt || ""}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-100"
        />

        {currentImage.alt && (
          <div className="mt-3 text-center text-xs text-white/80 font-medium px-4 py-1.5 rounded-full bg-black/60 border border-white/10 max-w-lg truncate">
            {currentImage.alt}
          </div>
        )}
      </div>

      {/* Next Button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex + 1) % total);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-white/80 hover:text-white transition-none focus:outline-none"
          title="Next (Right Arrow)"
        >
          <CaretRight weight="thin" size={24} />
        </button>
      )}
    </div>
  );
}
