import fs from "fs";
import path from "path";
import { prisma } from "./db";
import { CategoryItem, DocPageItem, DocSpaceItem, SearchResultItem, TocItem } from "./types";
import { parseHeadingsFromMarkdown } from "./markdown";

export { parseHeadingsFromMarkdown };

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "docs-store.json");

const INITIAL_DATA: DocSpaceItem[] = [
  {
    id: "space-dev-docs",
    name: "Developer Docs",
    slug: "dev-docs",
    description: "Internal engineering documentation and architecture guidelines.",
    order: 1,
    isDefault: true,
    categories: [
      {
        id: "cat-getting-started",
        docSpaceId: "space-dev-docs",
        name: "Getting Started",
        slug: "getting-started",
        order: 1,
        isCollapsed: false,
      },
      {
        id: "cat-core-arch",
        docSpaceId: "space-dev-docs",
        name: "Core Architecture",
        slug: "core-architecture",
        order: 2,
        isCollapsed: false,
      },
      {
        id: "cat-components",
        docSpaceId: "space-dev-docs",
        name: "Components",
        slug: "components",
        order: 3,
        isCollapsed: false,
      },
    ],
    pages: [
      {
        id: "page-overview",
        docSpaceId: "space-dev-docs",
        categoryId: "cat-getting-started",
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-contributing",
        docSpaceId: "space-dev-docs",
        categoryId: "cat-getting-started",
        title: "Contributing",
        slug: "contributing",
        description: "Learn how to contribute to Kumo, from setup and workflows to PR and release guidelines. Everything you need for setup, development, quality checks, and PR process is documented here.",
        content: `Learn how to contribute to Kumo, from setup and workflows to PR and release guidelines. Everything you need for setup, development, quality checks, and PR process is documented here.

## Before You Start
For non-trivial changes, start with alignment before coding:
- Comment on an existing issue or open one first.
- Confirm scope, API direction, and migration impact.
- For small fixes/docs tweaks, you can go straight to a PR.

## 1. Get Set Up Once
From repo root:
\`\`\`bash
pnpm install
pnpm dev
\`\`\`

### Repository Access and Branching
Ensure you have cloned the repository and created a new branch following the standard convention:
\`\`\`bash
git checkout -b feat/my-new-feature
\`\`\`

## 2. Pick the Right Contribution Type
Before writing code, decide whether this is a component, primitive, fix, or documentation change:
- **Component**: Reusable design system block.
- **Fix**: Bug repair without changing API signatures.
- **Doc update**: Adding guides and code snippets.

## 3. Start the Dev Loop
Run the local development server:
\`\`\`bash
npm run dev
\`\`\`
Changes are immediately reflected via hot module reloading.

## 4. Implement the Change
Follow the official Cloudflare design rules:
1. Always use 14px for content text.
2. Always sentence case headings.
3. Use \`font-semibold\` for headings and \`font-medium\` for bold text—never use \`font-bold\`.
4. Never transition colors for hover states.

## 5. Run Validation Before PR
Run the test suite and type check:
\`\`\`bash
npm run build
\`\`\`

## 6. Handle Changesets Correctly
Generate a changeset for your patch or minor bump.

## 7. Open and Maintain the PR
Submit your pull request and link corresponding issues.

## PR Previews and Tests
Automated checks will run on every push to your branch.

## Release Process (How Your Change Ships)
Merged changes are automatically versioned and deployed to internal registry.

## Practical Guidelines
Keep PRs focused on a single responsibility to speed up code reviews.

## Related Docs
See Architecture overview and Component specifications.
`,
        tocAnchors: JSON.stringify([
          { id: "before-you-start", text: "Before You Start", level: 2, enabled: true },
          { id: "1-get-set-up-once", text: "1. Get Set Up Once", level: 2, enabled: true },
          { id: "repository-access-and-branching", text: "Repository Access and Branching", level: 3, enabled: true },
          { id: "2-pick-the-right-contribution-type", text: "2. Pick the Right Contribution Type", level: 2, enabled: true },
          { id: "3-start-the-dev-loop", text: "3. Start the Dev Loop", level: 2, enabled: true },
          { id: "4-implement-the-change", text: "4. Implement the Change", level: 2, enabled: true },
          { id: "5-run-validation-before-pr", text: "5. Run Validation Before PR", level: 2, enabled: true },
          { id: "6-handle-changesets-correctly", text: "6. Handle Changesets Correctly", level: 2, enabled: true },
          { id: "7-open-and-maintain-the-pr", text: "7. Open and Maintain the PR", level: 2, enabled: true },
          { id: "pr-previews-and-tests", text: "PR Previews and Tests", level: 2, enabled: true },
          { id: "release-process-how-your-change-ships", text: "Release Process (How Your Change Ships)", level: 2, enabled: true },
          { id: "practical-guidelines", text: "Practical Guidelines", level: 2, enabled: true },
          { id: "related-docs", text: "Related Docs", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["contributing", "git", "setup", "pull request", "pr", "workflow"]),
        order: 2,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-system-design",
        docSpaceId: "space-dev-docs",
        categoryId: "cat-core-arch",
        title: "System Design",
        slug: "system-design",
        description: "High-level overview of our architecture, network edge, and data pipelines.",
        content: `This document explains the high-level architecture of our services.

## Edge layer
Incoming traffic is terminated at the edge with DDoS mitigation, SSL termination, and routing rules.

## Service topology
Microservices communicate over gRPC with protobuf definitions.

### Database architecture
We employ PostgreSQL for relational state and distributed caching for read-heavy workloads.
`,
        tocAnchors: JSON.stringify([
          { id: "edge-layer", text: "Edge layer", level: 2, enabled: true },
          { id: "service-topology", text: "Service topology", level: 2, enabled: true },
          { id: "database-architecture", text: "Database architecture", level: 3, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["architecture", "edge", "grpc", "postgres", "topology"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-button",
        docSpaceId: "space-dev-docs",
        categoryId: "cat-components",
        title: "Button",
        slug: "button",
        description: "Interactive button supporting primary, secondary, destructive, and subtle variants.",
        content: `Buttons allow users to take actions and make choices with a single tap.

## Variants
- **Primary**: Use for the primary action on a page or container.
- **Secondary**: Use for secondary or alternative actions.
- **Destructive**: Use for dangerous actions like deleting a resource.
- **Subtle / Ghost**: Use for minimal clutter in toolbars.

## Usage example
\`\`\`tsx
import { Button } from "@cloudflare/kumo";
import { Plus } from "@phosphor-icons/react";

export function Example() {
  return (
    <Button variant="primary" icon={<Plus weight="thin" size={16} />}>
      Add item
    </Button>
  );
}
\`\`\`
`,
        tocAnchors: JSON.stringify([
          { id: "variants", text: "Variants", level: 2, enabled: true },
          { id: "usage-example", text: "Usage example", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["button", "actions", "component", "ui"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "space-company-wiki",
    name: "Company Wiki",
    slug: "company-wiki",
    description: "Internal company policies, handbook, and team directories.",
    order: 2,
    isDefault: false,
    categories: [
      {
        id: "cat-handbook",
        docSpaceId: "space-company-wiki",
        name: "General Handbook",
        slug: "general-handbook",
        order: 1,
        isCollapsed: false,
      },
    ],
    pages: [
      {
        id: "page-welcome-wiki",
        docSpaceId: "space-company-wiki",
        categoryId: "cat-handbook",
        title: "Company Handbook",
        slug: "handbook",
        description: "General guidelines, communication etiquette, and team resources.",
        content: `Welcome to our Company Wiki. Here you will find policies, team directories, and standard operating procedures.

## Communication guidelines
We prioritize asynchronous communication:
- Write clear issue descriptions.
- Document decisions publicly.

## Tools & Access
Check the IT portal for VPN credentials and password managers.
`,
        tocAnchors: JSON.stringify([
          { id: "communication-guidelines", text: "Communication guidelines", level: 2, enabled: true },
          { id: "tools-access", text: "Tools & Access", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["handbook", "company", "wiki", "communication", "policies"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "space-api-ref",
    name: "API Reference",
    slug: "api-reference",
    description: "REST API endpoints, authentication tokens, and request schemas.",
    order: 3,
    isDefault: false,
    categories: [
      {
        id: "cat-endpoints",
        docSpaceId: "space-api-ref",
        name: "Core Endpoints",
        slug: "core-endpoints",
        order: 1,
        isCollapsed: false,
      },
    ],
    pages: [
      {
        id: "page-auth-api",
        docSpaceId: "space-api-ref",
        categoryId: "cat-endpoints",
        title: "Authentication",
        slug: "authentication",
        description: "API authentication via Bearer tokens.",
        content: `All requests to the REST API must be authenticated using an API token in the Authorization header.

## Request format
\`\`\`bash
curl -H "Authorization: Bearer <YOUR_API_TOKEN>" \\
  https://api.internal.company.com/v1/user
\`\`\`

## Error responses
- \`401 Unauthorized\`: Missing or invalid token.
- \`403 Forbidden\`: Token lacks required permissions.
`,
        tocAnchors: JSON.stringify([
          { id: "request-format", text: "Request format", level: 2, enabled: true },
          { id: "error-responses", text: "Error responses", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["api", "rest", "auth", "token", "endpoints"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

function ensureFileStorage(): DocSpaceItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf8");
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(content) as DocSpaceItem[];
  } catch (err) {
    console.warn("Falling back to in-memory INITIAL_DATA:", err);
    return INITIAL_DATA;
  }
}

function writeFileStorage(data: DocSpaceItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to file storage:", err);
  }
}

// Check if PostgreSQL Prisma is active and working
let isPostgresHealthy: boolean | null = null;
async function canUsePrisma(): Promise<boolean> {
  if (isPostgresHealthy !== null) return isPostgresHealthy;
  try {
    // Quick test query
    await prisma.$queryRaw`SELECT 1`;
    isPostgresHealthy = true;
    return true;
  } catch {
    isPostgresHealthy = false;
    return false;
  }
}

export async function getAllDocSpaces(): Promise<DocSpaceItem[]> {
  const usePrisma = await canUsePrisma();
  if (usePrisma) {
    try {
      const spaces = await prisma.docSpace.findMany({
        orderBy: { order: "asc" },
        include: {
          categories: {
            orderBy: { order: "asc" },
          },
          pages: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (spaces.length > 0) {
        return spaces.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          isDefault: s.isDefault,
          categories: s.categories.map((c) => ({
            id: c.id,
            docSpaceId: c.docSpaceId,
            name: c.name,
            slug: c.slug,
            order: c.order,
            isCollapsed: c.isCollapsed,
          })),
          pages: s.pages.map((p) => ({
            id: p.id,
            docSpaceId: p.docSpaceId,
            categoryId: p.categoryId,
            title: p.title,
            slug: p.slug,
            description: p.description,
            content: p.content,
            tocAnchors: p.tocAnchors,
            searchKeywords: p.searchKeywords,
            order: p.order,
            isPublished: p.isPublished,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          })),
        }));
      }
    } catch (err) {
      console.warn("Prisma error in getAllDocSpaces, using file store:", err);
    }
  }

  return ensureFileStorage();
}

export async function getDocSpaceBySlug(slug: string): Promise<DocSpaceItem | null> {
  const spaces = await getAllDocSpaces();
  return spaces.find((s) => s.slug === slug) ?? null;
}

export async function getPageBySlug(
  docSlug: string,
  pageSlug: string
): Promise<{ space: DocSpaceItem; page: DocPageItem } | null> {
  const space = await getDocSpaceBySlug(docSlug);
  if (!space) return null;
  const page = space.pages.find((p) => p.slug === pageSlug);
  if (!page) return null;
  return { space, page };
}

export async function saveDocSpace(spaceData: Partial<DocSpaceItem>): Promise<DocSpaceItem> {
  const spaces = ensureFileStorage();
  const id = spaceData.id || `space-${Date.now()}`;
  const existingIdx = spaces.findIndex((s) => s.id === id);

  const updatedSpace: DocSpaceItem = {
    id,
    name: spaceData.name || "Untitled Doc Space",
    slug: spaceData.slug || `space-${Date.now()}`,
    description: spaceData.description || "",
    order: spaceData.order ?? (existingIdx >= 0 ? spaces[existingIdx].order : spaces.length + 1),
    isDefault: !!spaceData.isDefault,
    categories: existingIdx >= 0 ? spaces[existingIdx].categories : [],
    pages: existingIdx >= 0 ? spaces[existingIdx].pages : [],
  };

  if (existingIdx >= 0) {
    spaces[existingIdx] = updatedSpace;
  } else {
    spaces.push(updatedSpace);
  }

  writeFileStorage(spaces);

  if (await canUsePrisma()) {
    try {
      await prisma.docSpace.upsert({
        where: { id: updatedSpace.id },
        update: {
          name: updatedSpace.name,
          slug: updatedSpace.slug,
          description: updatedSpace.description,
          order: updatedSpace.order,
          isDefault: updatedSpace.isDefault,
        },
        create: {
          id: updatedSpace.id,
          name: updatedSpace.name,
          slug: updatedSpace.slug,
          description: updatedSpace.description,
          order: updatedSpace.order,
          isDefault: updatedSpace.isDefault,
        },
      });
    } catch (e) {
      console.warn("Prisma sync failed for docSpace:", e);
    }
  }

  return updatedSpace;
}

export async function deleteDocSpace(id: string): Promise<boolean> {
  const spaces = ensureFileStorage();
  const filtered = spaces.filter((s) => s.id !== id);
  writeFileStorage(filtered);

  if (await canUsePrisma()) {
    try {
      await prisma.docSpace.delete({ where: { id } });
    } catch (e) {
      console.warn("Prisma delete failed:", e);
    }
  }

  return true;
}

export async function saveCategory(categoryData: Partial<CategoryItem>): Promise<CategoryItem> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === categoryData.docSpaceId);
  if (!space) throw new Error("Doc space not found");

  const id = categoryData.id || `cat-${Date.now()}`;
  const existingIdx = space.categories.findIndex((c) => c.id === id);

  const updatedCategory: CategoryItem = {
    id,
    docSpaceId: space.id,
    name: categoryData.name || "Untitled Category",
    slug: categoryData.slug || `cat-${Date.now()}`,
    order: categoryData.order ?? (existingIdx >= 0 ? space.categories[existingIdx].order : space.categories.length + 1),
    isCollapsed: !!categoryData.isCollapsed,
  };

  if (existingIdx >= 0) {
    space.categories[existingIdx] = updatedCategory;
  } else {
    space.categories.push(updatedCategory);
  }

  writeFileStorage(spaces);

  if (await canUsePrisma()) {
    try {
      await prisma.category.upsert({
        where: { id: updatedCategory.id },
        update: {
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          order: updatedCategory.order,
          isCollapsed: updatedCategory.isCollapsed,
        },
        create: {
          id: updatedCategory.id,
          docSpaceId: updatedCategory.docSpaceId,
          name: updatedCategory.name,
          slug: updatedCategory.slug,
          order: updatedCategory.order,
          isCollapsed: updatedCategory.isCollapsed,
        },
      });
    } catch (e) {
      console.warn("Prisma sync failed for category:", e);
    }
  }

  return updatedCategory;
}

export async function deleteCategory(docSpaceId: string, categoryId: string): Promise<boolean> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === docSpaceId);
  if (space) {
    space.categories = space.categories.filter((c) => c.id !== categoryId);
    // Unassign category from pages
    space.pages.forEach((p) => {
      if (p.categoryId === categoryId) p.categoryId = null;
    });
    writeFileStorage(spaces);
  }

  if (await canUsePrisma()) {
    try {
      await prisma.category.delete({ where: { id: categoryId } });
    } catch (e) {
      console.warn("Prisma delete category failed:", e);
    }
  }

  return true;
}

export async function saveDocPage(pageData: Partial<DocPageItem>): Promise<DocPageItem> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === pageData.docSpaceId);
  if (!space) throw new Error("Doc space not found");

  const id = pageData.id || `page-${Date.now()}`;
  const existingIdx = space.pages.findIndex((p) => p.id === id);

  const updatedPage: DocPageItem = {
    id,
    docSpaceId: space.id,
    categoryId: pageData.categoryId ?? null,
    title: pageData.title || "Untitled Page",
    slug: pageData.slug || `page-${Date.now()}`,
    description: pageData.description || "",
    content: pageData.content || "",
    tocAnchors: pageData.tocAnchors || "[]",
    searchKeywords: pageData.searchKeywords || "[]",
    order: pageData.order ?? (existingIdx >= 0 ? space.pages[existingIdx].order : space.pages.length + 1),
    isPublished: pageData.isPublished !== undefined ? pageData.isPublished : true,
    createdAt: existingIdx >= 0 ? space.pages[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    space.pages[existingIdx] = updatedPage;
  } else {
    space.pages.push(updatedPage);
  }

  writeFileStorage(spaces);

  if (await canUsePrisma()) {
    try {
      await prisma.docPage.upsert({
        where: { id: updatedPage.id },
        update: {
          categoryId: updatedPage.categoryId,
          title: updatedPage.title,
          slug: updatedPage.slug,
          description: updatedPage.description,
          content: updatedPage.content,
          tocAnchors: updatedPage.tocAnchors,
          searchKeywords: updatedPage.searchKeywords,
          order: updatedPage.order,
          isPublished: updatedPage.isPublished,
        },
        create: {
          id: updatedPage.id,
          docSpaceId: updatedPage.docSpaceId,
          categoryId: updatedPage.categoryId,
          title: updatedPage.title,
          slug: updatedPage.slug,
          description: updatedPage.description,
          content: updatedPage.content,
          tocAnchors: updatedPage.tocAnchors,
          searchKeywords: updatedPage.searchKeywords,
          order: updatedPage.order,
          isPublished: updatedPage.isPublished,
        },
      });
    } catch (e) {
      console.warn("Prisma sync failed for docPage:", e);
    }
  }

  return updatedPage;
}

export async function deleteDocPage(docSpaceId: string, pageId: string): Promise<boolean> {
  const spaces = ensureFileStorage();
  const space = spaces.find((s) => s.id === docSpaceId);
  if (space) {
    space.pages = space.pages.filter((p) => p.id !== pageId);
    writeFileStorage(spaces);
  }

  if (await canUsePrisma()) {
    try {
      await prisma.docPage.delete({ where: { id: pageId } });
    } catch (e) {
      console.warn("Prisma delete docPage failed:", e);
    }
  }

  return true;
}

export async function searchDocs(query: string): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const spaces = await getAllDocSpaces();
  const results: SearchResultItem[] = [];

  for (const space of spaces) {
    for (const page of space.pages) {
      if (!page.isPublished) continue;

      const category = space.categories.find((c) => c.id === page.categoryId);
      const url = `/docs/${space.slug}/${page.slug}`;

      // 1. Match Page Title
      if (page.title.toLowerCase().includes(q)) {
        results.push({
          title: page.title,
          url,
          docSpaceName: space.name,
          categoryName: category?.name,
          type: "page",
          snippet: page.description || page.content.slice(0, 100),
        });
      }

      // 2. Match Custom Search Keywords
      let keywords: string[] = [];
      try {
        keywords = JSON.parse(page.searchKeywords || "[]");
      } catch {
        keywords = [];
      }
      for (const kw of keywords) {
        if (kw.toLowerCase().includes(q)) {
          results.push({
            title: `${page.title} (Keyword: ${kw})`,
            url,
            docSpaceName: space.name,
            categoryName: category?.name,
            type: "keyword",
            snippet: `Tagged with: ${kw}`,
          });
          break;
        }
      }

      // 3. Match Headings (TOC anchors)
      let anchors: TocItem[] = [];
      try {
        anchors = JSON.parse(page.tocAnchors || "[]");
      } catch {
        anchors = [];
      }
      for (const heading of anchors) {
        if (heading.text.toLowerCase().includes(q)) {
          results.push({
            title: `${page.title} > ${heading.text}`,
            url: `${url}#${heading.id}`,
            docSpaceName: space.name,
            categoryName: category?.name,
            type: "heading",
            snippet: `Section heading on ${page.title}`,
          });
        }
      }

      // 4. Match Content body snippet
      const contentLower = page.content.toLowerCase();
      const contentIdx = contentLower.indexOf(q);
      if (contentIdx >= 0) {
        const start = Math.max(0, contentIdx - 40);
        const end = Math.min(page.content.length, contentIdx + q.length + 60);
        const snippet = "..." + page.content.slice(start, end).replace(/\n/g, " ") + "...";
        // Avoid duplicate if already matched by title
        if (!results.some((r) => r.url === url && r.type === "page")) {
          results.push({
            title: page.title,
            url,
            docSpaceName: space.name,
            categoryName: category?.name,
            type: "page",
            snippet,
          });
        }
      }
    }
  }

  return results.slice(0, 20);
}
