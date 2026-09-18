"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Check,
  SquaresFour,
  Trash,
  UploadSimple,
  Plus,
  Spinner,
  FrameCorners,
  Eye,
} from "@phosphor-icons/react";
import { GalleryImage } from "@/lib/markdown";

interface GallerySettingsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (markdownTag: string) => void;
}

export function GallerySettingsModal({
  open,
  onClose,
  onConfirm,
}: GallerySettingsModalProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const [ratio, setRatio] = useState<"16:9" | "4:3" | "1:1" | "natural">("16:9");
  const [hasBorder, setHasBorder] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlCaption, setUrlCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const uploaded: GalleryImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.success && json.url) {
          const altText = file.name.replace(/\.[^/.]+$/, "") || `Image ${images.length + i + 1}`;
          uploaded.push({ src: json.url, alt: altText });
        }
      }

      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading some images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [
      ...prev,
      { src: urlInput.trim(), alt: urlCaption.trim() || `Image ${prev.length + 1}` },
    ]);
    setUrlInput("");
    setUrlCaption("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCaption = (index: number, newAlt: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt: newAlt } : img))
    );
  };

  const handleInsert = () => {
    if (images.length === 0) {
      alert("Please add at least one image to the gallery.");
      return;
    }

    let block = `\n:::gallery cols=${cols} ratio=${ratio} border=${hasBorder}\n`;
    for (const img of images) {
      block += `![${img.alt.trim() || "image"}](${img.src})\n`;
    }
    block += `:::\n\n`;

    onConfirm(block);
    onClose();
  };

  const gridColClass =
    cols === 2
      ? "grid-cols-2"
      : cols === 4
      ? "grid-cols-4"
      : "grid-cols-3";

  const ratioClass =
    ratio === "16:9"
      ? "aspect-video object-cover"
      : ratio === "4:3"
      ? "aspect-[4/3] object-cover"
      : ratio === "1:1"
      ? "aspect-square object-cover"
      : "h-20 object-contain";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100 select-none">
      <div
        className="w-full max-w-2xl rounded-lg border border-kumo-line bg-kumo-elevated shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-kumo-hairline bg-kumo-base shrink-0">
          <div className="flex items-center gap-2">
            <SquaresFour weight="thin" size={18} className="text-kumo-brand" />
            <h3 className="text-sm font-semibold text-kumo-strong">
              Create Image Gallery / Album Grid
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-kumo-subtle hover:text-kumo-default"
          >
            <X weight="thin" size={16} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Visual Mini Preview */}
          {images.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] text-kumo-subtle mb-1.5 font-medium">
                <div className="flex items-center gap-1">
                  <Eye weight="thin" size={14} />
                  <span>Gallery Preview ({images.length} images)</span>
                </div>
                <span>{cols} Columns · {ratio}</span>
              </div>
              <div className="p-3 rounded-lg border border-kumo-hairline bg-kumo-canvas max-h-48 overflow-y-auto">
                <div className={`grid ${gridColClass} gap-2`}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`overflow-hidden ${
                        hasBorder
                          ? "rounded border border-kumo-line bg-kumo-base p-0.5"
                          : "rounded"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.alt}
                        className={`w-full ${ratioClass} block rounded`}
                      />
                      {img.alt && (
                        <div className="text-[9px] text-kumo-subtle text-center py-0.5 truncate px-1">
                          {img.alt}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border border-kumo-hairline bg-kumo-control/40">
            {/* Columns */}
            <div>
              <label className="block font-medium text-kumo-strong mb-1.5">
                Columns (จำนวนคอลัมน์)
              </label>
              <div className="grid grid-cols-3 gap-1">
                {([2, 3, 4] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCols(c)}
                    className={`py-1.5 px-2 rounded border transition-none font-mono text-center ${
                      cols === c
                        ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-semibold"
                        : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                    }`}
                  >
                    {c} cols
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block font-medium text-kumo-strong mb-1.5">
                Aspect Ratio (อัตราส่วน)
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(["16:9", "4:3", "1:1", "natural"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRatio(r)}
                    className={`py-1.5 px-1 rounded border transition-none font-mono text-[11px] text-center ${
                      ratio === r
                        ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-semibold"
                        : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                    }`}
                  >
                    {r === "natural" ? "Auto" : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Style */}
            <div>
              <label className="block font-medium text-kumo-strong mb-1.5">
                Border Style (สไตล์กรอบ)
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setHasBorder(false)}
                  className={`py-1.5 px-2 rounded border transition-none text-center ${
                    !hasBorder
                      ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-semibold"
                      : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                  }`}
                >
                  Borderless
                </button>
                <button
                  type="button"
                  onClick={() => setHasBorder(true)}
                  className={`py-1.5 px-2 rounded border transition-none text-center ${
                    hasBorder
                      ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-semibold"
                      : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                  }`}
                >
                  Framed
                </button>
              </div>
            </div>
          </div>

          {/* Upload and Add Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-kumo-strong">
                Gallery Images ({images.length})
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none disabled:opacity-50 font-medium"
              >
                {isUploading ? (
                  <Spinner weight="thin" size={14} className="animate-spin text-kumo-brand" />
                ) : (
                  <UploadSimple weight="thin" size={14} />
                )}
                <span>Upload images (Multi)</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => {
                  handleFilesUpload(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>

            {/* URL input bar */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste image URL (e.g. /uploads/photo.jpg)..."
                className="flex-1 px-3 py-1.5 rounded border border-kumo-line bg-kumo-control text-kumo-default text-xs font-mono focus:outline-none focus:border-kumo-brand"
              />
              <input
                type="text"
                value={urlCaption}
                onChange={(e) => setUrlCaption(e.target.value)}
                placeholder="Caption..."
                className="w-32 px-3 py-1.5 rounded border border-kumo-line bg-kumo-control text-kumo-default text-xs focus:outline-none focus:border-kumo-brand"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-kumo-line bg-kumo-base hover:bg-kumo-tint text-kumo-default transition-none disabled:opacity-50"
              >
                <Plus weight="thin" size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Images List */}
            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border border-dashed border-kumo-line rounded-lg text-center cursor-pointer hover:border-kumo-brand/60 bg-kumo-control/20"
              >
                <SquaresFour weight="thin" size={32} className="mx-auto text-kumo-subtle mb-2" />
                <p className="font-medium text-kumo-strong text-xs">
                  No images added yet
                </p>
                <p className="text-[11px] text-kumo-subtle mt-0.5">
                  Click here or click "Upload images (Multi)" to select multiple files
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg border border-kumo-line bg-kumo-base"
                  >
                    <span className="text-[10px] font-mono text-kumo-subtle w-4 text-center">
                      {index + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-12 h-12 object-cover rounded border border-kumo-hairline bg-kumo-recessed shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => handleUpdateCaption(index, e.target.value)}
                        placeholder="Image caption / alt text..."
                        className="w-full px-2 py-1 rounded border border-kumo-hairline bg-kumo-control text-xs text-kumo-default focus:outline-none focus:border-kumo-brand"
                      />
                      <div className="text-[10px] font-mono text-kumo-subtle truncate mt-0.5">
                        {img.src}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1.5 text-kumo-subtle hover:text-red-500 rounded hover:bg-kumo-tint"
                      title="Remove image"
                    >
                      <Trash weight="thin" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 border-t border-kumo-hairline bg-kumo-base flex items-center justify-between shrink-0">
          <span className="text-xs text-kumo-subtle">
            {images.length} {images.length === 1 ? "image" : "images"} in album
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-kumo-line hover:bg-kumo-tint text-kumo-default text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              disabled={images.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-kumo-brand hover:bg-kumo-brand-hover text-kumo-brand-foreground font-medium shadow-xs text-xs disabled:opacity-50"
            >
              <Check weight="thin" size={14} />
              <span>Insert Gallery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
