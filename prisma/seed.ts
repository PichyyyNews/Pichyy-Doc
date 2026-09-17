import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with initial doc spaces...");

  // 1. Developer Docs
  const devDocs = await prisma.docSpace.upsert({
    where: { slug: "dev-docs" },
    update: {},
    create: {
      id: "space-dev-docs",
      name: "Developer Docs",
      slug: "dev-docs",
      description: "Internal engineering documentation and architecture guidelines.",
      order: 1,
      isDefault: true,
    },
  });

  const catGettingStarted = await prisma.category.upsert({
    where: {
      docSpaceId_slug: {
        docSpaceId: devDocs.id,
        slug: "getting-started",
      },
    },
    update: {},
    create: {
      id: "cat-getting-started",
      docSpaceId: devDocs.id,
      name: "Getting Started",
      slug: "getting-started",
      order: 1,
    },
  });

  await prisma.docPage.upsert({
    where: {
      docSpaceId_slug: {
        docSpaceId: devDocs.id,
        slug: "overview",
      },
    },
    update: {},
    create: {
      id: "page-overview",
      docSpaceId: devDocs.id,
      categoryId: catGettingStarted.id,
      title: "Overview",
      slug: "overview",
      description: "Welcome to the central developer documentation portal.",
      content: `Welcome to the central engineering documentation. This system provides developer specifications, internal guidelines, and design system components.

## What is this platform?
This platform serves as our internal single source of truth for technical architecture, development standards, and reusable UI components.

## Core principles
- **High performance**: Fast response times and edge caching.
- **Utilitarian UI**: Clean hairline borders, standard 14px typography, and zero clutter.
- **Strict standards**: Consistency across all internal tooling.

### Key technologies
- **Next.js 15 (App Router)**: Full-stack React framework.
- **Cloudflare Kumo UI**: Authentic design system tokens and components.
- **PostgreSQL & Prisma**: Robust data persistence.
`,
      tocAnchors: JSON.stringify([
        { id: "what-is-this-platform", text: "What is this platform?", level: 2, enabled: true },
        { id: "core-principles", text: "Core principles", level: 2, enabled: true },
        { id: "key-technologies", text: "Key technologies", level: 3, enabled: true },
      ]),
      searchKeywords: JSON.stringify(["overview", "introduction", "welcome", "getting started"]),
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
