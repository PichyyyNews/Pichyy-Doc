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
    id: "space-teaching-practicum",
    name: "Teaching Practicum",
    slug: "teaching-practicum",
    description: "Educational institution teaching practicum documentation, lesson plans, and portfolio.",
    order: 1,
    isDefault: true,
    categories: [
      {
        id: "cat-introduction",
        docSpaceId: "space-teaching-practicum",
        name: "Introduction",
        slug: "introduction",
        order: 1,
        isCollapsed: false,
      },
    ],
    pages: [
      {
        id: "page-about",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "About Me",
        slug: "about",
        description: "Personal profile, academic background, and student teaching credentials of Pichayut Sombun.",
        content: `# About Me

> Welcome to my teaching practicum portfolio and documentation portal. This section outlines my personal background, education, and current academic standing.

## Personal Profile

- **Full Name**: Mr. Pichayut Sombun (นาย พิชญุตย์ สมบุญ)
- **Role**: Pre-Service Teacher / Student Teacher (นักศึกษาฝึกประสบการณ์วิชาชีพครู)
- **Academic Year**: 3rd Year Undergraduate (ชั้นปีที่ 3)
- **Student ID**: \`672041510113\`
- **Program / Branch**: TCT DERA
- **Status**: Currently undergoing Educational Institution Teaching Practicum

## Academic Background

I am currently pursuing a Bachelor of Science in Technical Education at King Mongkut's University of Technology North Bangkok:

- **Department**: Department of Computer Education (ภาควิชาคอมพิวเตอร์ศึกษา)
- **Faculty**: Faculty of Technical Education (คณะครุศาสตร์อุตสาหกรรม)
- **University**: King Mongkut's University of Technology North Bangkok (KMUTNB) (มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ)

## Current Practicum Status

I am actively engaged in my **Educational Institution Teaching Practicum** (การฝึกสอนสถานศึกษา). This practicum provides real-world pedagogical training, curriculum delivery, and instructional design experience in an accredited vocational institution.

### Objectives of the Practicum

1. **Instructional Delivery**: Deliver structured computer education curricula adhering to modern technical standards.
2. **Pedagogical Practice**: Implement effective classroom management, technical demonstrations, and student assessments.
3. **Mentorship & Guidance**: Support students in developing practical computer skills, ethics, and professional technical competencies.
`,
        tocAnchors: JSON.stringify([
          { id: "personal-profile", text: "Personal Profile", level: 2, enabled: true },
          { id: "academic-background", text: "Academic Background", level: 2, enabled: true },
          { id: "current-practicum-status", text: "Current Practicum Status", level: 2, enabled: true },
          { id: "objectives-of-the-practicum", text: "Objectives of the Practicum", level: 3, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["about", "profile", "pichayut", "sombun", "kmutnb", "computer education", "tct"]),
        order: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "page-college",
        docSpaceId: "space-teaching-practicum",
        categoryId: "cat-introduction",
        title: "About the College",
        slug: "college",
        description: "Institutional profile of Lopburi Technical College and assigned teaching practicum responsibilities.",
        content: `# About the College

> Institutional overview of Lopburi Technical College, host department information, and assigned teaching coursework.

## Institutional Profile

- **Institution Name**: Lopburi Technical College (วิทยาลัยเทคนิคลพบุรี)
- **Address**: 323 Narai Maharach Road, Thale Chup Sorn Subdistrict, Mueang Lop Buri District, Lop Buri 15000, Thailand
- **Telephone**: \`036-411-083\` / \`+66 36 411 083\`
- **Jurisdiction**: Vocational Education Commission, Ministry of Education, Thailand

## Host Department

I am stationed at the **Department of Computer Technology** (แผนกวิชาเทคโนโลยีคอมพิวเตอร์), which focuses on providing technical and vocational skills across hardware, networking, programming, and IT applications.

## Teaching Assignments

During this practicum period, I am assigned to teach students across two academic tiers: the **Vocational Certificate (ปวช.)** and the **High Vocational Certificate (ปวส.)**, encompassing a total of **4 classroom cohorts**:

### Vocational Certificate Level (ปวช.)
- **Program**: Computer Technical (ช่างเทคนิคคอมพิวเตอร์)
- **Grade**: Year 1 (ปวช. 1)
- **Classrooms (2 Rooms)**:
  - \`1 ชทค 1\` (Section 1)
  - \`1 ชทค 2\` (Section 2)

### High Vocational Certificate Level (ปวส.)
- **Program**: Computer Technology (เทคโนโลยีคอมพิวเตอร์)
- **Grade**: Year 1 (ปวส. 1)
  - **Classroom (1 Room)**: \`1 สทค 2\`
- **Grade**: Year 2 (ปวส. 2)
  - **Classroom (1 Room)**: \`2 สทค 4\`

## Summary of Teaching Load

| Level | Program / Major | Academic Year | Section Code | Cohort Name |
| :--- | :--- | :--- | :--- | :--- |
| **Vocational (ปวช.)** | Computer Technical | Year 1 | Section 1 | \`1 ชทค 1\` |
| **Vocational (ปวช.)** | Computer Technical | Year 1 | Section 2 | \`1 ชทค 2\` |
| **High Vocational (ปวส.)** | Computer Technology | Year 1 | Section 2 | \`1 สทค 2\` |
| **High Vocational (ปวส.)** | Computer Technology | Year 2 | Section 4 | \`2 สทค 4\` |
`,
        tocAnchors: JSON.stringify([
          { id: "institutional-profile", text: "Institutional Profile", level: 2, enabled: true },
          { id: "host-department", text: "Host Department", level: 2, enabled: true },
          { id: "teaching-assignments", text: "Teaching Assignments", level: 2, enabled: true },
          { id: "vocational-certificate-level", text: "Vocational Certificate Level (ปวช.)", level: 3, enabled: true },
          { id: "high-vocational-certificate-level", text: "High Vocational Certificate Level (ปวส.)", level: 3, enabled: true },
          { id: "summary-of-teaching-load", text: "Summary of Teaching Load", level: 2, enabled: true },
        ]),
        searchKeywords: JSON.stringify(["college", "lopburi", "technical", "practicum", "teaching", "computer technology", "ปวช", "ปวส"]),
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
