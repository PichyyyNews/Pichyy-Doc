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

  const lines = markdown.split("\n");
  const segments: MarkdownSegment[] = [];
  let currentMarkdownLines: string[] = [];
  let inCodeBlock = false;
  let inGallery = false;
  let galleryHeader = "";
  let galleryLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check code block fence (``` or ~~~)
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      currentMarkdownLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      currentMarkdownLines.push(line);
      continue;
    }

    // Check gallery start (ONLY outside code blocks!)
    if (!inGallery && trimmed.startsWith(":::gallery")) {
      // Flush previous markdown segment
      if (currentMarkdownLines.length > 0) {
        const content = currentMarkdownLines.join("\n");
        if (content.trim()) {
          segments.push({ type: "markdown", content });
        }
        currentMarkdownLines = [];
      }
      inGallery = true;
      galleryHeader = line.substring(line.indexOf(":::gallery") + 10);
      galleryLines = [];
      continue;
    }

    // Check gallery end
    if (inGallery && trimmed === ":::") {
      inGallery = false;
      const body = galleryLines.join("\n");

      // Parse options from header
      const colsMatch = galleryHeader.match(/cols=(\d+)/i);
      let cols: 2 | 3 | 4 = 3;
      if (colsMatch) {
        const parsedCols = parseInt(colsMatch[1], 10);
        if (parsedCols === 2 || parsedCols === 3 || parsedCols === 4) {
          cols = parsedCols;
        }
      }

      const ratioMatch = galleryHeader.match(/ratio=([\w:/]+)/i);
      let ratio: "16:9" | "4:3" | "1:1" | "natural" = "16:9";
      if (ratioMatch) {
        const r = ratioMatch[1].toLowerCase();
        if (r === "4:3" || r === "1:1" || r === "natural" || r === "16:9") {
          ratio = r as any;
        }
      }

      const borderMatch = galleryHeader.match(/border=(true|false)/i);
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
      continue;
    }

    if (inGallery) {
      galleryLines.push(line);
    } else {
      currentMarkdownLines.push(line);
    }
  }

  // If still in gallery without closing :::, push as markdown
  if (inGallery) {
    currentMarkdownLines.push(`:::gallery${galleryHeader}`);
    currentMarkdownLines.push(...galleryLines);
  }

  if (currentMarkdownLines.length > 0) {
    const content = currentMarkdownLines.join("\n");
    if (content.trim()) {
      segments.push({ type: "markdown", content });
    }
  }

  return segments.length > 0 ? segments : [{ type: "markdown", content: markdown }];
}

