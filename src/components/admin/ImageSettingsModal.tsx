"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Image as ImageIcon, FrameCorners, Eye } from "@phosphor-icons/react";

interface ImageSettingsModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
  initialAlt?: string;
  onConfirm: (markdownTag: string) => void;
}

export function ImageSettingsModal({
  open,
  onClose,
  imageUrl = "",
  initialAlt = "",
  onConfirm,
}: ImageSettingsModalProps) {
  const [url, setUrl] = useState(imageUrl);
  const [caption, setCaption] = useState(initialAlt);
  const [hasBorder, setHasBorder] = useState(false); // Default to borderless as requested
  const [widthPreset, setWidthPreset] = useState<"100%" | "75%" | "50%" | "300px" | "custom">("100%");
  const [customWidth, setCustomWidth] = useState("500px");
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [wrap, setWrap] = useState(false);

  useEffect(() => {
    if (open) {
      setUrl(imageUrl || "");
      setCaption(initialAlt || "image");
      setHasBorder(false);
      setWidthPreset("100%");
      setAlign("center");
      setWrap(false);
    }
  }, [open, imageUrl, initialAlt]);

  if (!open) return null;

  const resolvedWidth = widthPreset === "custom" ? customWidth : widthPreset;
  const activeUrl = url.trim() || imageUrl;

  const handleInsert = () => {
    if (!activeUrl) {
      alert("Please enter an image URL or upload an image.");
      return;
    }
    const params = new URLSearchParams();
    if (!hasBorder) params.set("border", "false");
    if (resolvedWidth !== "100%") params.set("width", resolvedWidth);
    if (align !== "center") params.set("align", align);
    if (wrap && align !== "center") params.set("wrap", "true");

    const paramString = params.toString();
    const finalUrl = paramString ? `${activeUrl}#${paramString}` : activeUrl;
    const cleanCaption = caption.trim() || "image";
    const markdown = `\n![${cleanCaption}](${finalUrl})\n`;

    onConfirm(markdown);
    onClose();
  };

  const alignClass =
    align === "center" ? "mx-auto" : align === "right" ? "ml-auto mr-0" : "mr-auto ml-0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg rounded-lg border border-kumo-line bg-kumo-elevated shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-kumo-hairline bg-kumo-base">
          <div className="flex items-center gap-2">
            <ImageIcon weight="thin" size={18} className="text-kumo-brand" />
            <h3 className="text-sm font-semibold text-kumo-strong">Image Layout & Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 text-kumo-subtle hover:text-kumo-default">
            <X weight="thin" size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Visual Mini Preview */}
          <div>
            <div className="flex items-center gap-1 text-[11px] text-kumo-subtle mb-1.5 font-medium">
              <Eye weight="thin" size={14} />
              <span>Preview</span>
            </div>
            <div className="p-3 rounded-lg border border-kumo-hairline bg-kumo-canvas min-h-[120px] flex items-center justify-center overflow-hidden">
              {wrap && align !== "center" ? (
                <div className="text-[11px] text-kumo-subtle leading-relaxed overflow-hidden w-full">
                  <div
                    className={`transition-all ${align === "right" ? "float-right ml-3 mb-2" : "float-left mr-3 mb-2"}`}
                    style={{ width: widthPreset === "100%" ? "45%" : resolvedWidth, maxWidth: "55%" }}
                  >
                    <div
                      className={`overflow-hidden ${
                        hasBorder
                          ? "rounded-lg border border-kumo-line bg-kumo-base p-1"
                          : "rounded"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeUrl}
                        alt={caption}
                        className="w-full h-auto max-h-28 object-contain block mx-auto"
                      />
                      {hasBorder && caption && (
                        <div className="text-[9px] text-kumo-subtle text-center py-0.5 border-t border-kumo-hairline mt-1 truncate">
                          {caption}
                        </div>
                      )}
                    </div>
                    {!hasBorder && caption && (
                      <div className="text-[9px] text-kumo-subtle text-center mt-0.5 truncate">
                        {caption}
                      </div>
                    )}
                  </div>
                  <p>
                    This platform serves as our internal single source of truth for technical architecture, development standards, and reusable UI components across all projects. Text flows smoothly alongside the image in the same row without awkward gaps.
                  </p>
                </div>
              ) : (
                <div
                  className={`transition-all ${alignClass}`}
                  style={{ width: resolvedWidth, maxWidth: "100%" }}
                >
                  <div
                    className={`overflow-hidden ${
                      hasBorder
                        ? "rounded-lg border border-kumo-line bg-kumo-base p-1"
                        : "rounded"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeUrl}
                      alt={caption}
                      className="w-full h-auto max-h-40 object-contain block mx-auto"
                    />
                    {hasBorder && caption && (
                      <div className="text-[10px] text-kumo-subtle text-center py-1 border-t border-kumo-hairline mt-1">
                        {caption}
                      </div>
                    )}
                  </div>
                  {!hasBorder && caption && (
                    <div className="text-[10px] text-kumo-subtle text-center mt-1">
                      {caption}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Image URL / Source */}
          <div>
            <label className="block font-medium text-kumo-strong mb-1">
              Image URL / Path (ที่อยู่รูปภาพ)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. /uploads/image.png or https://example.com/photo.jpg"
              className="w-full px-3 py-1.5 rounded border border-kumo-line bg-kumo-control text-kumo-default font-mono text-xs focus:outline-none focus:border-kumo-brand"
            />
          </div>

          {/* Caption / Alt Text */}
          <div>
            <label className="block font-medium text-kumo-strong mb-1">
              Caption / Alt Text
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Description of the image..."
              className="w-full px-3 py-1.5 rounded border border-kumo-line bg-kumo-control text-kumo-default focus:outline-none focus:border-kumo-brand"
            />
          </div>

          {/* Border Toggle (Borderless vs Framed) */}
          <div>
            <label className="block font-medium text-kumo-strong mb-1.5">
              Border Style (กรอบรูปภาพ)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasBorder(false)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded border transition-none text-left ${
                  !hasBorder
                    ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-medium"
                    : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                }`}
              >
                <span>Borderless (ไม่มีกรอบ)</span>
              </button>

              <button
                type="button"
                onClick={() => setHasBorder(true)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded border transition-none text-left ${
                  hasBorder
                    ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-medium"
                    : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                }`}
              >
                <FrameCorners weight="thin" size={14} />
                <span>Framed (มีกรอบการ์ด)</span>
              </button>
            </div>
          </div>

          {/* Size / Width Control */}
          <div>
            <label className="block font-medium text-kumo-strong mb-1.5">
              Size / Width (ขนาดความกว้าง)
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {(["100%", "75%", "50%", "300px", "custom"] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWidthPreset(preset)}
                  className={`py-1.5 px-2 rounded border transition-none text-center font-mono text-[11px] ${
                    widthPreset === preset
                      ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-semibold"
                      : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                  }`}
                >
                  {preset === "100%"
                    ? "100% (Full)"
                    : preset === "75%"
                    ? "75% (L)"
                    : preset === "50%"
                    ? "50% (M)"
                    : preset === "300px"
                    ? "300px (S)"
                    : "Custom"}
                </button>
              ))}
            </div>

            {widthPreset === "custom" && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="e.g. 450px or 65%"
                  className="w-full px-3 py-1.5 rounded border border-kumo-line bg-kumo-control text-kumo-default font-mono text-xs focus:outline-none focus:border-kumo-brand"
                />
              </div>
            )}
          </div>

          {/* Alignment */}
          <div>
            <label className="block font-medium text-kumo-strong mb-1.5">
              Alignment (การจัดวางตำแหน่ง)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["left", "center", "right"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAlign(item)}
                  className={`py-1.5 px-3 rounded border capitalize transition-none text-center ${
                    align === item
                      ? "border-kumo-brand bg-kumo-brand/10 text-kumo-brand font-semibold"
                      : "border-kumo-line bg-kumo-base text-kumo-default hover:bg-kumo-tint"
                  }`}
                >
                  {item === "left" ? "ชิดซ้าย (Left)" : item === "center" ? "กึ่งกลาง (Center)" : "ชิดขวา (Right)"}
                </button>
              ))}
            </div>

            {/* Text Wrap Toggle (Active for Left / Right) */}
            {align !== "center" && (
              <div className="mt-2.5 p-2.5 rounded-lg border border-kumo-hairline bg-kumo-control/60 flex items-center justify-between gap-3 animate-in fade-in duration-150">
                <div>
                  <span className="font-medium text-kumo-strong block text-xs">
                    Text Wrap (ให้ข้อความไหลเคียงข้างรูปภาพ)
                  </span>
                  <span className="text-[11px] text-kumo-subtle block mt-0.5">
                    รูปภาพจะลอย{align === "right" ? "ชิดขวา" : "ชิดซ้าย"} และให้ข้อความย่อหน้าไหลประกบข้างรูปภาพในแถวเดียวกันแบบ Side-by-Side
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={wrap}
                  onClick={() => setWrap(!wrap)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    wrap ? "bg-kumo-brand" : "bg-kumo-line"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      wrap ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-kumo-hairline bg-kumo-base flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-kumo-line hover:bg-kumo-tint text-kumo-default"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-kumo-brand hover:bg-kumo-brand-hover text-white font-medium shadow-xs"
          >
            <Check weight="thin" size={14} />
            <span>Insert into Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
