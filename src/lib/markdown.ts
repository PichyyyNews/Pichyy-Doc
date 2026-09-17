import { TocItem } from "./types";

export function parseHeadingsFromMarkdown(markdown: string): TocItem[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const headings: TocItem[] = [];
  const idCounts: Record<string, number> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    const h2Match = trimmed.match(/^##\s+(.+)$/);
    const h3Match = trimmed.match(/^###\s+(.+)$/);

    if (h2Match || h3Match) {
      const level = h2Match ? 2 : 3;
      const rawText = (h2Match ? h2Match[1] : h3Match![1]).trim();
      // Remove any markdown links or styling in text
      const cleanText = rawText.replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/[`*_~]/g, "");
      
      let baseId = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      if (!baseId) baseId = `section-${headings.length + 1}`;

      let finalId = baseId;
      if (idCounts[baseId]) {
        finalId = `${baseId}-${idCounts[baseId]}`;
        idCounts[baseId]++;
      } else {
        idCounts[baseId] = 1;
      }

      headings.push({
        id: finalId,
        text: cleanText,
        level,
        enabled: true,
      });
    }
  }

  return headings;
}

export interface ImageOptions {
  cleanSrc: string;
  hasBorder: boolean;
  width: string;
  align: "left" | "center" | "right";
  wrap: boolean;
}

export function parseImageSrc(src?: string): ImageOptions {
  if (!src) {
    return { cleanSrc: "", hasBorder: true, width: "100%", align: "center", wrap: false };
  }

  const hashIndex = src.indexOf("#");
  if (hashIndex === -1) {
    return { cleanSrc: src, hasBorder: true, width: "100%", align: "center", wrap: false };
  }

  const cleanSrc = src.substring(0, hashIndex);
  const hash = src.substring(hashIndex + 1);
  const params = new URLSearchParams(hash);

  const borderParam = params.get("border");
  const hasBorder = borderParam !== "false" && borderParam !== "none" && borderParam !== "0";
  const width = params.get("width") || params.get("size") || "100%";
  const alignParam = (params.get("align") || "center").toLowerCase();
  const align = (alignParam === "left" || alignParam === "right" ? alignParam : "center") as "left" | "center" | "right";
  const wrapParam = params.get("wrap");
  const wrap = wrapParam === "true" || wrapParam === "1";

  return { cleanSrc, hasBorder, width, align, wrap };
}

