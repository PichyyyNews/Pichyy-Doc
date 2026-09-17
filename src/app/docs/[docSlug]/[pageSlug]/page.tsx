import { notFound } from "next/navigation";
import { DocNavbar } from "@/components/docs/DocNavbar";
import { DocSidebar } from "@/components/docs/DocSidebar";
import { DocContent } from "@/components/docs/DocContent";
import { OnThisPage } from "@/components/docs/OnThisPage";
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
    <div className="min-h-screen bg-kumo-canvas text-kumo-default">
      {/* Top Navbar */}
      <DocNavbar spaces={spaces} currentSpaceSlug={space.slug} />

      {/* 3-Column Layout Container */}
      <div className="max-w-[96rem] mx-auto flex justify-between">
        {/* Left Sidebar */}
        <DocSidebar space={space} currentPageSlug={page.slug} />

        {/* Center Main Content Area */}
        <DocContent space={space} page={page} tocAnchors={anchors} />

        {/* Right Sidebar: On This Page */}
        <OnThisPage tocItems={anchors} />
      </div>
    </div>
  );
}
