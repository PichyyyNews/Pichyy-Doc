import { notFound } from "next/navigation";
import { DocLayoutClient } from "@/components/docs/DocLayoutClient";
import { getAllDocSpaces, getPageBySlug, parseHeadingsFromMarkdown } from "@/lib/storage";
import { TocItem } from "@/lib/types";

interface PageProps {
  params: Promise<{
    docSlug: string;
    pageSlug: string;
  }>;
}

export default async function DocPageView({ params }: PageProps) {
  const { docSlug, pageSlug } = await params;
  const spaces = await getAllDocSpaces();
  const pageData = await getPageBySlug(docSlug, pageSlug);

  if (!pageData) {
    notFound();
  }

  const { space, page } = pageData;

  // Resolve TOC anchors (from stored JSON or dynamically parsed)
  let anchors: TocItem[] = [];
  try {
    anchors = JSON.parse(page.tocAnchors || "[]");
  } catch {
    anchors = [];
  }

  if (anchors.length === 0) {
    anchors = parseHeadingsFromMarkdown(page.content);
  }

  return (
    <DocLayoutClient
      spaces={spaces}
      space={space}
      page={page}
      tocAnchors={anchors}
    />
  );
}
