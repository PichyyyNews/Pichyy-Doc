# Kumo UI Documentation & Blog Platform

A modern, high-performance documentation and knowledge base platform built strictly with **Next.js 15 (App Router)**, **Cloudflare Kumo UI Design System**, **Tailwind CSS**, and **PostgreSQL with Prisma ORM** (with resilient local JSON storage fallback).

Designed with authentic Cloudflare dashboard aesthetics: 14px content typography, sentence case headers, thin iconography (`@phosphor-icons/react` with `weight="thin"`), frosted glassmorphism, and zero visual clutter.

---

## 🌟 Key Features

### 1. 3-Column Public Documentation Viewer
- **Sticky Glassmorphism Top Navbar**:
  - Clean brand mark (`Kumo`).
  - Multi-space navigation tabs (e.g. *Developer Docs*, *Company Wiki*, *API Reference*).
  - Frosted backdrop blur effect (`backdrop-filter: blur(16px)`).
  - Minimal theme toggle switch (System / Dark / Light).
- **Collapsible Left Sidebar**:
  - Search trigger input (`Cmd+K` / `Ctrl+K`).
  - Root pages and collapsible category accordions with smooth chevron indicators.
  - Hairline borders separating navigation hierarchy.
- **Main Content Area**:
  - Action bar with **"Copy page"** dropdown (Copy URL, Copy Markdown, Copy Title).
  - Sentence case typography adhering to Cloudflare design guidelines.
  - Automatically linked section headings with `#` anchor links.
  - Syntax-highlighted code blocks with language badges and one-click copy buttons.
  - Callout blockquotes with Kumo orange accent (`#F6821F`).
  - Next / Previous page pagination.
- **Right Sidebar ("ON THIS PAGE")**:
  - Sticky table of contents.
  - Real-time scrollspy with vertical blue active indicator bar (`w-[2px] bg-blue-600`).

### 2. Advanced Responsive Image Layout & Lightbox
- **Interactive Image Settings Dialog**: Upload via file picker, drag-and-drop, or clipboard paste (`Ctrl+V`).
- **Borderless Mode**: Clean presentation with no card border, blending directly into the text.
- **Framed Mode**: Card container with hairline border and caption bar.
- **Custom Widths**: Presets for `100%` (Full), `75%` (Large), `50%` (Medium), `300px` (Small), or custom `px` / `%`.
- **Alignment**: Left, Center, or Right.
- **Side-by-Side Text Wrap**: Float images to the left or right with text flowing smoothly in the same row on desktop, automatically reverting to a clean stacked view on mobile (< 768px).
- **Heading Clearance**: Subsequent headings (`h2`, `h3`, `hr`) automatically clear floats (`clear: both`).
- **Click-to-Zoom Lightbox**: Full-resolution interactive modal preview on click.

### 3. Image Gallery & Album Grid (`:::gallery`)
- **Multi-column Grid**: Organize photos into 2, 3, or 4 columns with responsive mobile folding.
- **Aspect Ratio Control**: Choose Uniform tiles (`16:9`, `4:3`, `1:1`) for aligned rows or Natural file aspect ratios.
- **Border Customization**: Framed Kumo cards or sleek borderless tiles.
- **Interactive Album Lightbox**: Step through all album photos using `<` and `>` buttons or keyboard Left/Right arrows with position indicator (`X / Y`).
- **Visual Modal Builder**: Multi-file batch upload and live grid preview from the admin editor toolbar.

### 4. Command Palette Search (`Cmd+K` / `Ctrl+K`)
- Instant fuzzy search across page titles, headings, content snippets, and admin-assigned keywords.
- Keyboard accessible navigation (Up / Down arrow keys, Enter to jump, ESC to close).

### 4. Admin Management Console (`/admin`)
- **Protected Access**: PIN-based authentication (`ADMIN_PIN="030347"`) with secure HTTP-only cookies.
- **Content Editor**:
  - Split View: Live Markdown source editor + real-time rendered preview.
  - **"On This Page" Anchor Manager**: Toggle which detected H2/H3 headings display in the public TOC.
  - **Search Keywords Tagger**: Add custom indexable keywords per document.
- **Hierarchy & Structure**:
  - Add, reorder, and manage doc spaces.
  - Create and reorder categories.
  - Move pages between categories or root level.

### 5. Resilient Dual-Storage Engine
- Connects to PostgreSQL via Prisma ORM when available.
- **Zero-Config Fallback**: Automatically falls back to local JSON storage (`data/docs-store.json`) if PostgreSQL is not running, allowing instant zero-dependency deployment and offline development.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Components**: [@cloudflare/kumo](https://kumo-ui.com/), Base UI primitives
- **Icons**: [@phosphor-icons/react](https://phosphoricons.com/) (strictly `weight="thin"`)
- **Styling**: Tailwind CSS with custom Kumo semantic design tokens
- **Database / ORM**: PostgreSQL & Prisma ORM (with automatic JSON storage fallback)
- **Markdown Processing**: `react-markdown`, `remark-gfm`

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/PichyyyNews/kumo-ui-docs-platform.git
cd kumo-ui-docs-platform
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Contents of `.env`:
```env
# Optional: PostgreSQL Connection (fallback JSON storage used if unavailable)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kumo_docs?schema=public"

# Admin Console Security PIN
ADMIN_PIN="030347"

NODE_ENV="development"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation portal.

### 4. Access Admin Console

Visit [http://localhost:3000/admin](http://localhost:3000/admin) and enter your PIN (Default: `030347`).

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 📄 License

MIT License. Designed with Cloudflare Kumo UI Design System guidelines.
