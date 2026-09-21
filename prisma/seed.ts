import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Pichyy-Doc starter doc space...");

  const guideSpace = await prisma.docSpace.upsert({
    where: { slug: "guide" },
    update: {},
    create: {
      id: "space-guide",
      name: "Platform Guide",
      slug: "guide",
      description: "Complete guide, usage instructions, and component references for the Pichyy-Doc platform.",
      order: 1,
      isDefault: true,
    },
  });

  const catGettingStarted = await prisma.category.upsert({
    where: {
      docSpaceId_slug: {
        docSpaceId: guideSpace.id,
        slug: "getting-started",
      },
    },
    update: {},
    create: {
      id: "cat-getting-started",
      docSpaceId: guideSpace.id,
      name: "Getting Started",
      slug: "getting-started",
      order: 1,
    },
  });

  await prisma.docPage.upsert({
    where: {
      docSpaceId_slug: {
        docSpaceId: guideSpace.id,
        slug: "welcome",
      },
    },
    update: {},
    create: {
      id: "page-welcome",
      docSpaceId: guideSpace.id,
      categoryId: catGettingStarted.id,
      title: "Welcome to Pichyy-Doc",
      slug: "welcome",
      description: "An introduction to Pichyy-Doc, a modern open-source documentation platform built with Next.js 15 and Cloudflare Kumo UI.",
      content: `> Welcome to **Pichyy-Doc** — a high-performance, utilitarian documentation and internal knowledge base platform engineered with Next.js 15 (App Router) and the Cloudflare Kumo UI design system.

## Overview

Pichyy-Doc was designed from the ground up to provide teams, developers, and creators with a lightning-fast, distraction-free documentation viewer paired with a powerful built-in administrative console.

### Key Highlights

- **Utilitarian Cloudflare Kumo UI**: Clean 14px typography, hairline borders, thin iconography, and frosted glassmorphic navigation.
- **3-Column Public Viewer**: Collapsible hierarchical sidebar, fluid central markdown reader with copy actions, and a sticky real-time scrollspy table of contents.
- **Resilient Dual-Storage Engine**: Seamless zero-config JSON file storage fallback with native PostgreSQL + Prisma ORM support when a database is available.
- **Built-in Admin Console**: Protected by PIN authentication, offering live markdown editing, visual gallery builders, TOC anchor managers, and drag-and-drop structural organization.
- **Command Palette Search**: Global \`Cmd+K\` / \`Ctrl+K\` modal searching titles, headings, snippets, and keywords.
`,
      tocAnchors: JSON.stringify([
        { id: "overview", text: "Overview", level: 2, enabled: true },
        { id: "key-highlights", text: "Key Highlights", level: 3, enabled: true },
      ]),
      searchKeywords: JSON.stringify(["welcome", "introduction", "overview", "pichyy-doc", "kumo", "getting started"]),
      order: 1,
      isPublished: true,
    },
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
