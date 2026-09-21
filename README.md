# Pichyy-Doc

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js" alt="Next.js"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="https://kumo-ui.com"><img src="https://img.shields.io/badge/Design_System-Cloudflare_Kumo_UI-F6821F?style=flat-square" alt="Kumo UI"></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/ORM-Prisma_6-2D3748?style=flat-square&logo=prisma" alt="Prisma"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"></a>
</p>

A modern, high-performance, utilitarian documentation and internal knowledge base platform engineered with **Next.js 15 (App Router)** and styled strictly according to the **Cloudflare Kumo UI Design System**.

**Pichyy-Doc** is designed to provide engineering teams, educators, open-source maintainers, and organizations with a distraction-free documentation experience coupled with an administrative console and zero-configuration dual-storage engine.

---

## 🌟 Key Features

### 1. 3-Column Public Documentation Viewer
- **Sticky Glassmorphic Navigation Bar**:
  - Brand identity mark with handwritten aesthetic flair.
  - Multi-space navigation tabs (e.g. *Developer Docs*, *API Reference*, *Company Handbook*).
  - Frosted backdrop blur effect (`backdrop-filter: blur(16px)`).
  - Minimal theme switcher (Dark / Light / System preference).
- **Collapsible Hierarchical Sidebar**:
  - Global search launcher (`Cmd+K` / `Ctrl+K`).
  - Document categories with collapsible accordion indicators.
  - Fine hairline dividers separating navigation hierarchy.
- **Main Content Reader**:
  - Quick action **"Copy page"** dropdown (Copy URL, Copy Markdown source, Copy Title).
  - Utilitarian typography (sentence case headings, standard 14px base content font).
  - Syntax-highlighted code blocks with language indicators and one-click copy buttons.
  - Responsive tables, task lists, and callout blockquotes.
  - Automatic pagination controls (Next / Previous document navigation).
- **Right Sidebar ("ON THIS PAGE")**:
  - Sticky table of contents with automatic heading anchor generation (`#`).
  - Real-time scrollspy with an active vertical indicator.

### 2. Advanced Media & Photo Galleries
- **Responsive Image Directives**:
  - Control layout through image URL parameters: `#border=true&width=75%&align=center&wrap=true`.
  - Floating side-by-side text wraps on desktop that automatically fold into stacked views on mobile devices.
- **Multi-Column Gallery Albums (`:::gallery`)**:
  - Organize photos into 2, 3, or 4 column grids with uniform aspect ratios (`16:9`, `4:3`, `1:1`).
  - Built-in multi-file batch upload dialog in the editor.
- **Interactive Fullscreen Lightbox**:
  - Zoom into any image or step through album galleries using keyboard arrow keys (Left / Right).

### 3. Command Palette Search (`Cmd+K` / `Ctrl+K`)
- Instant fuzzy search across document titles, headings, content snippets, and administrator-assigned keywords.
- Full keyboard accessibility (Up/Down arrow navigation, Enter to jump, Escape to close).

### 4. Admin Management Console (`/admin`)
- **PIN Authentication**: Secure cookie-based access protected by a configurable numeric PIN (`ADMIN_PIN`).
- **Split-View Markdown Editor**: Real-time side-by-side preview with custom toolbars.
- **Heading Anchor Manager**: Interactively toggle which detected headings appear on the public TOC.
- **Search Keyword Tagger**: Attach indexable search keywords to pages for enhanced discoverability.
- **Hierarchy Organization**: Drag-and-drop or reorder spaces, categories, and documents.

### 5. Resilient Dual-Storage Engine
- **PostgreSQL + Prisma ORM**: Enterprise relational database support for high concurrency.
- **Zero-Config File Fallback**: If PostgreSQL is unreachable or not configured, Pichyy-Doc automatically reads and writes to local JSON storage (`data/docs-store.json`), enabling instant offline development and zero-dependency deployments.

---

## 🏗️ Architecture Overview

```text
+-------------------------------------------------------------------+
|                            Pichyy-Doc                             |
+-------------------------------------------------------------------+
|  Public Viewer (/docs)              |  Admin Console (/admin)     |
|  - Sticky Frosted Topbar            |  - PIN Authentication       |
|  - Hierarchical Nav Tree            |  - Live Markdown Editor     |
|  - GFM Reader + Code Copy           |  - Visual Gallery Builder   |
|  - Command Palette (Cmd+K)          |  - Doc Spaces Hierarchy     |
|  - Interactive Lightbox             |  - TOC Anchor Visibility    |
+-------------------------------------+-----------------------------+
|                        Storage Engine Layer                       |
|                          (src/lib/storage.ts)                     |
|                                                                   |
|             [ PostgreSQL Active? ]                                |
|                /                \                                 |
|         (Yes) /                  \ (No / Unset)                   |
|              v                    v                               |
|   Prisma ORM (PostgreSQL)      Local JSON (data/docs-store.json)  |
+-------------------------------------------------------------------+
```

---

## 📂 Project Structure

```text
Pichyy-Doc/
├── build.sh                  # Production build shell script
├── dev.sh                    # Development launcher shell script
├── setup.sh                  # Automated setup and installer script
├── start.sh                  # Production server runner script
├── LICENSE                   # MIT License
├── README.md                 # Project documentation
├── .env.example              # Environment variable template
├── data/
│   └── docs-store.json       # Resilient local JSON storage
├── prisma/
│   ├── schema.prisma         # Prisma relational database schema
│   └── seed.ts               # Database seed script
├── public/
│   └── uploads/              # Local uploaded media directory (.gitkeep)
└── src/
    ├── app/
    │   ├── admin/            # Admin console & authentication routes
    │   ├── api/              # REST endpoints (docs, search, admin, upload)
    │   ├── docs/             # Public 3-column documentation viewer
    │   ├── globals.css       # Global styles & Kumo UI design tokens
    │   └── layout.tsx        # Root layout & theme providers
    ├── components/
    │   ├── admin/            # Admin editor, space managers, modals
    │   ├── docs/             # Navbar, sidebar, TOC, lightbox, galleries
    │   └── kumo/             # Kumo UI design system components & themes
    └── lib/
        ├── db.ts             # Prisma client instance
        ├── markdown.ts       # Markdown parsing & heading extractors
        ├── storage.ts        # Dual storage engine (PostgreSQL + JSON fallback)
        └── types.ts          # Shared TypeScript interfaces
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.18.0` or higher (`v20+` or `v22+` LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Automated Setup (Recommended)

Clone the repository and run the automated setup script:

```bash
git clone https://github.com/PichyyyNews/Pichyy-Doc.git
cd Pichyy-Doc

# Make scripts executable and run setup
chmod +x *.sh
./setup.sh
```

The setup script will:
1. Verify Node.js and package manager versions.
2. Create `.env` from `.env.example` if not already present.
3. Install all dependencies.
4. Prepare storage directories and generate the Prisma Client.

### 2. Manual Setup

If you prefer installing manually:

```bash
# 1. Clone repository
git clone https://github.com/PichyyyNews/Pichyy-Doc.git
cd Pichyy-Doc

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Generate Prisma Client
npm run db:generate

# 5. Start development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to view your documentation.

---

## ⚙️ Environment Variables

Pichyy-Doc is designed to work immediately without any database configured. You can customize runtime settings in `.env`:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Optional PostgreSQL connection string. If omitted, invalid, or offline, local JSON storage is used automatically. |
| `ADMIN_PIN` | `123456` | 6-digit numeric PIN used to unlock the `/admin` portal. **Change this in production.** |
| `SESSION_SECRET` | `pichyy-doc-secret...` | Secret string used to sign administrator authentication cookies. |
| `NODE_ENV` | `development` | Runtime mode (`development` or `production`). |

---

## 🛠️ Shell Scripts Reference

Executable shell scripts are included in the root directory for standard operations:

| Script | Command | Description |
| :--- | :--- | :--- |
| **Setup** | `./setup.sh` | Full automated installation, environment setup, and Prisma client generation. |
| **Development** | `./dev.sh` | Starts the Next.js development server on port 3000. |
| **Build** | `./build.sh` | Runs Prisma generation and compiles an optimized production build (`next build`). |
| **Start** | `./start.sh` | Launches the compiled Next.js production server. |

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your environment variables in Vercel Project Settings:
   - `ADMIN_PIN`: A secure 6-digit PIN.
   - `SESSION_SECRET`: A secure random secret string.
   - `DATABASE_URL`: *(Optional)* Managed PostgreSQL database (e.g. Neon, Supabase, Vercel Postgres).
4. Click **Deploy**.

### Deploy with Docker

A production-ready multi-stage Docker build:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

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
```

Build and run the container:

```bash
docker build -t pichyy-doc .
docker run -p 3000:3000 -d pichyy-doc
```

### Deploy on Linux VPS (PM2 & Nginx)

```bash
# 1. Clone & Setup
git clone https://github.com/PichyyyNews/Pichyy-Doc.git
cd Pichyy-Doc
./setup.sh

# 2. Build for production
./build.sh

# 3. Start with PM2
pm2 start npm --name "pichyy-doc" -- start
pm2 save
```

---

## 🔒 Security Best Practices

1. **Change Default PIN**: Always set a custom, strong `ADMIN_PIN` before exposing the instance to public networks.
2. **Session Salt**: Ensure `SESSION_SECRET` is set to a long, cryptographically strong random string.
3. **Storage Directory**: When relying on JSON fallback storage on persistent servers, ensure the `data/` directory has appropriate read/write permissions for the application user.

---

## 📄 License

This project is open-source software licensed under the [MIT License](./LICENSE).

---

<p align="center">
  Crafted with care using <b>Next.js 15</b> & <b>Cloudflare Kumo UI</b>.
</p>
