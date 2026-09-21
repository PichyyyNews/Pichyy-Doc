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
    id: "space-guide",
    name: "Platform Guide",
    slug: "guide",
    description: "Complete guide, usage instructions, and component references for the Pichyy-Doc platform.",
    order: 1,
    isDefault: true,
    categories: [
      {
        id: "cat-getting-started",
        docSpaceId: "space-guide",
        name: "Getting Started",
        slug: "getting-started",
        order: 1,
        isCollapsed: false,
      },
      {
        id: "cat-authoring-features",
        docSpaceId: "space-guide",
        name: "Authoring & Features",
        slug: "authoring-features",
        order: 2,
        isCollapsed: false,
      },
      {
        id: "cat-system-deployment",
        docSpaceId: "space-guide",
        name: "System & Deployment",
        slug: "system-deployment",
        order: 3,
        isCollapsed: false,
      },
    ],
    pages: [
      {
        id: "page-welcome",
        docSpaceId: "space-guide",
        categoryId: "cat-getting-started",
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

## System Architecture

\`\`\`mermaid
flowchart LR
    Client[Browser Client]
    Viewer[Public Viewer]
    Admin[Admin Console]
    Storage[(Storage Layer)]

    Client --> Viewer & Admin
    Viewer & Admin --> Storage
\`\`\`

## Next Steps

Ready to get started with your own documentation? Check out the following sections:

1. [Quick Start & Setup](/docs/guide/quick-start) — Install and launch your own instance in minutes.
2. [Markdown & Typography](/docs/guide/markdown-typography) — Explore supported markdown formatting, code highlights, and tables.
3. [Media & Galleries](/docs/guide/media-galleries) — Discover advanced image layout modes and album grids.
4. [Deployment Guide](/docs/guide/deployment) — Ship your documentation to production using Docker, Vercel, or Linux servers.
`,
        tocAnchors: JSON.stringify([
          { id: "overview", text: "Overview", level: 2, enabled: true },
          { id: "key-highlights", text: "Key Highlights", level: 3, enabled: true },
          { id: "system-architecture", text: "System Architecture", level: 2, enabled: true },
          { id: "next-steps", text: "Next Steps", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["welcome", "introduction", "overview", "architecture", "pichyy-doc", "kumo", "getting started"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-quick-start",
        docSpaceId: "space-guide",
        categoryId: "cat-getting-started",
        title: "Quick Start & Setup",
        slug: "quick-start",
        description: "How to set up, configure, and launch your own Pichyy-Doc instance in minutes.",
        content: `> Get up and running with Pichyy-Doc locally on your machine in under two minutes.

## Prerequisites

Before running Pichyy-Doc, ensure you have the following installed:

- **Node.js**: v18.18.0 or later (Node.js 20+ / 22+ LTS recommended)
- **Package Manager**: npm, pnpm, or yarn
- **Git**: Installed and configured

## Quick Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/PichyyyNews/Pichyy-Doc.git
cd Pichyy-Doc
\`\`\`

### 2. Run Automated Setup

If you are on Linux or macOS, you can execute the setup shell script directly:

\`\`\`bash
chmod +x *.sh
./setup.sh
\`\`\`

Alternatively, install dependencies manually:

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

### 3. Start the Development Server

Run the development script or npm command:

\`\`\`bash
./dev.sh
# Or using npm:
npm run dev
\`\`\`

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

## Environment Variables

Pichyy-Doc works out of the box without any external database. Below is the reference for configurable environment variables in \`.env\`:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| \`DATABASE_URL\` | \`postgresql://...\` | Optional PostgreSQL connection string. If omitted or unreachable, local JSON storage is used automatically. |
| \`ADMIN_PIN\` | \`123456\` | 6-digit numeric PIN used to unlock the \`/admin\` portal. |
| \`SESSION_SECRET\` | \`pichyy-doc-secret...\` | Secret salt string used for administrative session tokens. |
| \`NODE_ENV\` | \`development\` | Environment mode (\`development\` or \`production\`). |

## Accessing the Admin Console

To manage documents, create spaces, or update categories:

1. Visit **[http://localhost:3000/admin](http://localhost:3000/admin)**.
2. Enter the default PIN: \`123456\`.
3. Access the full-featured split-pane markdown editor and organization dashboard.
`,
        tocAnchors: JSON.stringify([
          { id: "prerequisites", text: "Prerequisites", level: 2, enabled: true },
          { id: "quick-installation", text: "Quick Installation", level: 2, enabled: true },
          { id: "environment-variables", text: "Environment Variables", level: 2, enabled: true },
          { id: "accessing-the-admin-console", text: "Accessing the Admin Console", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["quick start", "installation", "setup", "env", "admin pin", "prerequisites", "run dev"]),
        order: 2,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-markdown-typography",
        docSpaceId: "space-guide",
        categoryId: "cat-authoring-features",
        title: "Markdown & Typography",
        slug: "markdown-typography",
        description: "Reference for Markdown syntax, typography, tables, callouts, and code blocks.",
        content: `> Pichyy-Doc supports GitHub Flavored Markdown (GFM) with syntax highlighting, automatic heading anchors, callout blockquotes, and tables.

## Heading Levels & TOC Integration

Headings formatted with \`#\` (H1), \`##\` (H2), and \`###\` (H3) are automatically registered with slugified anchor identifiers. You can click on any heading to copy or jump to its direct URL anchor.

### Heading Level 3 Example

In the Admin Console, you can selectively toggle which H2 and H3 headings appear in the sticky "On this page" table of contents.

## Syntax Highlighted Code Blocks

Code blocks feature language badges and a one-click copy button:

\`\`\`typescript
import { getAllDocSpaces } from "@/lib/storage";

export async function getSiteNavigation() {
  const spaces = await getAllDocSpaces();
  return spaces.map((space) => ({
    name: space.name,
    slug: space.slug,
    pageCount: space.pages.length,
  }));
}
\`\`\`

## Mermaid Diagrams & Architecture

Embed interactive diagrams directly inside Markdown using \`\`\`mermaid code fences. Pichyy-Doc automatically renders them as crisp, theme-adaptive vector SVGs with dynamic Light/Dark mode switching and a toggle to view or copy the underlying code:

\`\`\`mermaid
sequenceDiagram
    actor User
    participant App as Pichyy-Doc
    participant DB as Storage Layer
    
    User->>App: Request Document
    App->>DB: Fetch Content
    DB-->>App: Return Doc & Anchors
    App-->>User: Render Kumo UI Page
\`\`\`

### Supported Diagram Types

Pichyy-Doc supports all standard Mermaid diagram specifications:
- **Flowcharts & Graphs** (\`flowchart TD\`, \`graph LR\`)
- **Sequence Diagrams** (\`sequenceDiagram\`)
- **State Diagrams** (\`stateDiagram-v2\`)
- **Class & Object Diagrams** (\`classDiagram\`)
- **Entity-Relationship Diagrams** (\`erDiagram\`)
- **Git Graphs & Mindmaps** (\`gitGraph\`, \`mindmap\`)

## Blockquotes & Callouts

Use standard Markdown blockquotes for notices and tips:

> **Tip**: Pichyy-Doc automatically checks PostgreSQL connectivity on startup. If unavailable, it falls back seamlessly to \`data/docs-store.json\` without failing.

## Tables

Formatted GFM tables render with subtle hairline borders and alternating row styling:

| Feature | JSON Storage | PostgreSQL (Prisma) |
| :--- | :---: | :---: |
| Zero Config Setup | Yes | Requires DB Server |
| Offline Development | Yes | No |
| High Concurrency | Moderate | High |
| Production Scale | Good for small sites | Recommended |
`,
        tocAnchors: JSON.stringify([
          { id: "heading-levels-toc-integration", text: "Heading Levels & TOC Integration", level: 2, enabled: true },
          { id: "heading-level-3-example", text: "Heading Level 3 Example", level: 3, enabled: true },
          { id: "syntax-highlighted-code-blocks", text: "Syntax Highlighted Code Blocks", level: 2, enabled: true },
          { id: "mermaid-diagrams-architecture", text: "Mermaid Diagrams & Architecture", level: 2, enabled: true },
          { id: "supported-diagram-types", text: "Supported Diagram Types", level: 3, enabled: true },
          { id: "blockquotes-callouts", text: "Blockquotes & Callouts", level: 2, enabled: true },
          { id: "tables", text: "Tables", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["markdown", "syntax", "code blocks", "tables", "typography", "callouts", "headings", "mermaid", "diagram", "flowchart", "sequence"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-media-galleries",
        docSpaceId: "space-guide",
        categoryId: "cat-authoring-features",
        title: "Media & Gallery Layouts",
        slug: "media-galleries",
        description: "Guidelines for responsive images, floating text wraps, and multi-column photo galleries.",
        content: `> Pichyy-Doc includes advanced image layout directives, border options, width controls, floating wraps, and multi-column gallery albums with interactive lightboxes.

## Image Layout Directives

Images can be customized using URL hash query parameters:

- \`border=true|false\`: Toggle decorative hairline frame.
- \`width=100%|75%|50%|300px\`: Explicit width control.
- \`align=left|center|right\`: Horizontal alignment.
- \`wrap=true|false\`: Float image next to text with smooth desktop wrap.

### Centered Single Image Showcase

Here is a live demonstration of a centered hero image with a subtle border and 75% width constraint:

![Modern Architecture Facade](/demo/architecture-facade.jpg#border=true&width=75%&align=center)

### Floating Text Wrap

Using \`#wrap=true&align=right&width=45%\`, images can effortlessly float alongside editorial text on desktop screens while gracefully collapsing on mobile devices:

![Minimalist Workspace Desk](/demo/minimal-workspace.jpg#border=true&width=45%&align=right&wrap=true)

Modern workspace design emphasizes minimalism, natural light, and intentional spatial ergonomics. When engineering high-performance software systems and writing technical documentation, reducing visual clutter in physical surroundings directly mirrors the clarity of modular codebase design.

Pichyy-Doc's floating text wrap ensures that contextual media, architectural diagrams, and component screenshots complement written documentation rather than disrupting reading flow. On wider desktop viewports, text cascades naturally around the media block, while on tablet and mobile viewports, the layout smoothly stacks vertically for optimal legibility.

## Multi-Column Gallery Albums (\`:::gallery\`)

Create responsive photo grids with uniform aspect ratios and keyboard-navigable lightboxes:

### Interactive Photo Grid Showcase

Click any image below to trigger the interactive full-screen lightbox modal:

:::gallery cols=3 ratio=16:9 border=true
![Modern Office Interior](/demo/office-interior.jpg)
![Geometric Architectural Structure](/demo/geometric-structure.jpg)
![Modern Concrete Hallway](/demo/modern-hallway.jpg)
:::

### Gallery Options

| Parameter | Options | Description |
| :--- | :--- | :--- |
| \`cols\` | \`2\`, \`3\`, \`4\` | Number of columns on desktop view (collapses cleanly on mobile). |
| \`ratio\` | \`16:9\`, \`4:3\`, \`1:1\`, \`natural\` | Aspect ratio of image tiles. |
| \`border\` | \`true\`, \`false\` | Apply hairline border around photo tiles. |

## Interactive Lightbox

Clicking any image or gallery item automatically opens a full-screen interactive modal with zoom capability and keyboard navigation (Left/Right arrow keys to step through gallery items).
`,
        tocAnchors: JSON.stringify([
          { id: "image-layout-directives", text: "Image Layout Directives", level: 2, enabled: true },
          { id: "centered-single-image-showcase", text: "Centered Single Image Showcase", level: 3, enabled: true },
          { id: "floating-text-wrap", text: "Floating Text Wrap", level: 3, enabled: true },
          { id: "multi-column-gallery-albums-gallery", text: "Multi-Column Gallery Albums (:::gallery)", level: 2, enabled: true },
          { id: "interactive-photo-grid-showcase", text: "Interactive Photo Grid Showcase", level: 3, enabled: true },
          { id: "gallery-options", text: "Gallery Options", level: 3, enabled: true },
          { id: "interactive-lightbox", text: "Interactive Lightbox", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["media", "images", "gallery", "lightbox", "aspect ratio", "photo album", "responsive layout"]),
        order: 2,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-storage-architecture",
        docSpaceId: "space-guide",
        categoryId: "cat-system-deployment",
        title: "Storage & Database Engine",
        slug: "storage-architecture",
        description: "Understanding the resilient dual-layer data persistence: PostgreSQL Prisma ORM with automatic JSON fallback.",
        content: `> Pichyy-Doc employs a hybrid persistence strategy designed for zero-config local prototyping alongside enterprise-grade PostgreSQL scalability.

## How Dual Storage Works

1. **Health Check Probe**: When reading or writing documents, Pichyy-Doc executes a lightweight probe (\`SELECT 1\`) to test PostgreSQL connectivity.
2. **Database Active**: If PostgreSQL is healthy, Prisma ORM handles queries, relations, and transactions.
3. **Database Unavailable**: If PostgreSQL connection fails, times out, or is omitted, Pichyy-Doc automatically reads and writes to \`data/docs-store.json\`.

\`\`\`text
[ Client Request ]
       |
       v
[ Storage Engine (storage.ts) ]
       |
  +----+------------------------+
  |                             |
  v                             v
[ PostgreSQL OK? ]      [ PostgreSQL Unreachable ]
  |                             |
  v                             v
Prisma Client (DB)       Local File System (data/docs-store.json)
\`\`\`

## Switching Between Storage Modes

- **Local File Mode (Default)**: Keep \`DATABASE_URL\` empty or unset in your \`.env\`. All edits in the Admin Console immediately save to \`data/docs-store.json\`.
- **PostgreSQL Mode**: Set a valid \`DATABASE_URL\` in \`.env\` and run:

\`\`\`bash
npm run db:push
npm run db:seed
\`\`\`
`,
        tocAnchors: JSON.stringify([
          { id: "how-dual-storage-works", text: "How Dual Storage Works", level: 2, enabled: true },
          { id: "switching-between-storage-modes", text: "Switching Between Storage Modes", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["storage", "database", "prisma", "postgresql", "json store", "fallback", "architecture"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-deployment",
        docSpaceId: "space-guide",
        categoryId: "cat-system-deployment",
        title: "Deployment Guide",
        slug: "deployment",
        description: "Production deployment instructions for Vercel, Docker, VPS with PM2, and Cloudflare.",
        content: `> Guidelines for compiling and hosting Pichyy-Doc in staging and production environments.

## Option 1: Vercel Deployment

The quickest way to deploy Pichyy-Doc:

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the environment variables in Vercel Project Settings:
   - \`ADMIN_PIN\`: A secure 6-digit numeric PIN.
   - \`SESSION_SECRET\`: A secure random secret string.
   - \`DATABASE_URL\`: (Optional) PostgreSQL database connection.
4. Click **Deploy**.

## Option 2: Linux Server (PM2 & Node.js)

To run Pichyy-Doc on an Ubuntu/Debian VPS:

\`\`\`bash
# 1. Clone repository
git clone https://github.com/PichyyyNews/Pichyy-Doc.git
cd Pichyy-Doc

# 2. Run automated setup
./setup.sh

# 3. Compile production build
./build.sh

# 4. Start with PM2 process manager
pm2 start npm --name "pichyy-doc" -- start
pm2 save
\`\`\`

## Option 3: Docker Container

You can containerize Pichyy-Doc using a standard multi-stage Dockerfile:

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/data ./data

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Security Checklist for Production

- [ ] Change the default \`ADMIN_PIN\` to a strong unique PIN.
- [ ] Set \`SESSION_SECRET\` to a cryptographically secure random string.
- [ ] Enable HTTPS with SSL/TLS certificates (e.g. via Cloudflare or Let's Encrypt).
- [ ] Ensure the \`data/\` folder is writable by the application user if using JSON fallback storage.
`,
        tocAnchors: JSON.stringify([
          { id: "option-1-vercel-deployment", text: "Option 1: Vercel Deployment", level: 2, enabled: true },
          { id: "option-2-linux-server-pm2-nodejs", text: "Option 2: Linux Server (PM2 & Node.js)", level: 2, enabled: true },
          { id: "option-3-docker-container", text: "Option 3: Docker Container", level: 2, enabled: true },
          { id: "security-checklist-for-production", text: "Security Checklist for Production", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["deployment", "vercel", "docker", "pm2", "linux", "production", "nginx", "security"]),
        order: 2,
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
