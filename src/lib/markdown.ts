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

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryBlock {
  type: "gallery";
  cols: 2 | 3 | 4;
  ratio: "16:9" | "4:3" | "1:1" | "natural";
  hasBorder: boolean;
  images: GalleryImage[];
}

export interface MarkdownSegment {
  type: "markdown" | "gallery";
  content?: string;
  gallery?: GalleryBlock;
}

export function splitMarkdownGalleries(markdown: string): MarkdownSegment[] {
  if (!markdown) return [];

  const segments: MarkdownSegment[] = [];
  const galleryRegex = /:::gallery([^\n]*)\n([\s\S]*?):::/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = galleryRegex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = markdown.substring(lastIndex, match.index);
      if (textChunk.trim()) {
        segments.push({ type: "markdown", content: textChunk });
      }
    }

    const header = match[1] || "";
    const body = match[2] || "";

    // Parse options from header
    const colsMatch = header.match(/cols=(\d+)/i);
    let cols: 2 | 3 | 4 = 3;
    if (colsMatch) {
      const parsedCols = parseInt(colsMatch[1], 10);
      if (parsedCols === 2 || parsedCols === 3 || parsedCols === 4) {
        cols = parsedCols;
      }
    }

    const ratioMatch = header.match(/ratio=([\w:/]+)/i);
    let ratio: "16:9" | "4:3" | "1:1" | "natural" = "16:9";
    if (ratioMatch) {
      const r = ratioMatch[1].toLowerCase();
      if (r === "4:3" || r === "1:1" || r === "natural" || r === "16:9") {
        ratio = r as any;
      }
    }

    const borderMatch = header.match(/border=(true|false)/i);
    const hasBorder = borderMatch ? borderMatch[1].toLowerCase() !== "false" : true;

    // Parse images from body
    const images: GalleryImage[] = [];
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    let imgMatch: RegExpExecArray | null;
    while ((imgMatch = imgRegex.exec(body)) !== null) {
      images.push({
        alt: imgMatch[1] || "",
        src: imgMatch[2] || "",
      });
    }

    if (images.length > 0) {
      segments.push({
        type: "gallery",
        gallery: {
          type: "gallery",
          cols,
          ratio,
          hasBorder,
          images,
        },
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markdown.length) {
    const remaining = markdown.substring(lastIndex);
    if (remaining.trim()) {
      segments.push({ type: "markdown", content: remaining });
    }
  }

  // If no galleries found, return single markdown segment
  if (segments.length === 0) {
    return [{ type: "markdown", content: markdown }];
  }

  return segments;
}

