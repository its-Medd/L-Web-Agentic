# L'Web Agentic

A modern, pixel-perfect web project built with **Next.js 16**, **shadcn/ui**, and **Tailwind CSS v4**. Featuring smooth scroll animations, responsive design, and a clean component-driven architecture.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 (App Router) | Framework |
| [React](https://react.dev/) | 19 | UI runtime |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | latest | UI primitives |
| [GSAP](https://gsap.com/) | 3 | Animations |
| [Lenis](https://lenis.darkroom.engineering/) | 1 | Smooth scroll |
| [Lucide React](https://lucide.dev/) | latest | Icons |

---

## Prerequisites

- [Node.js](https://nodejs.org/) **v24+**
- npm (included with Node.js)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Commands

```bash
# Start development server (hot-reload)
npm run dev

# Build for production
npm run build

# Start production server (requires build first)
npm start

# Run ESLint
npm run lint

# Run TypeScript type-check
npm run typecheck

# Run all checks: lint + typecheck + build
npm run check
```

### Docker (optional)

```bash
# Build and run in production mode
docker compose up app --build

# Build and run in development mode (port 3001)
docker compose up dev --build
```

---

## Project Structure

```
src/
  app/                      # Next.js App Router pages and layouts
    layout.tsx              # Root layout (fonts, global styles)
    page.tsx                # Homepage
    globals.css             # Global CSS variables and base styles
    contact/                # Contact page
    over/                   # About page
    wat-we-doen/            # Services page
    werk/                   # Work/portfolio page
      [slug]/               # Dynamic project detail page
    faq/                    # FAQ page
    algemene-voorwaarden/   # Terms & conditions
    privacyverklaring/      # Privacy policy
  components/
    ui/                     # shadcn/ui primitives (Button, etc.)
    sites/
      L'WebAgentic/         # Page-specific components
        home.tsx            # Homepage sections
        site-primitives.tsx # Shared layout blocks, links, assets
        team-footer.tsx     # Team gallery + footer
        interior-pages.tsx  # Interior page layout
        page-transitions.tsx# Route transition animations
        motion.ts           # GSAP animation utilities
  lib/
    utils.ts                # cn() class-merging utility
  hooks/                    # Custom React hooks
  types/                    # TypeScript type definitions
public/
  images/                   # Static images
  videos/                   # Video assets
  sites/extrafazant/        # Site-specific fonts and media
scripts/
  .gitkeep                  # Placeholder (scripts folder reserved)
docs/
  (empty)                   # Documentation folder (reserved)
```

---

## Design System

Design tokens are defined as CSS custom properties in [`src/app/globals.css`](src/app/globals.css):

| Token | Value | Usage |
|---|---|---|
| `paper` | `#f4f4f4` | Background |
| `ink` | `#101010` | Text / foreground |
| `blue` | `#0038ff` | Accent |
| `pink` | `#ff77cd` | Accent |
| `orange` | `#ff5f04` | Accent |
| `white` | `#ffffff` | Surface |

Typography uses **Helvetica Now** (variable font) and a **Serrif** subset variable font, served from `public/sites/extrafazant/`.

---

## Code Style

- **TypeScript strict mode** — no `any`
- **Named exports** — PascalCase for components, camelCase for utilities
- **Tailwind utilities** — prefer utility classes; use CSS modules for complex layouts
- **2-space indentation**
- **Mobile-first responsive** design

---

## Features

- **Smooth scroll** via Lenis for native-like page scrolling
- **GSAP animations** — scroll-driven reveals, staggered parallax, and marquees
- **Responsive** — fluid layout from 390 px mobile to 1920 px desktop
- **Variable fonts** — weight, width, and optical-size axes for expressive typography
- **Hover interactions** — pointer-following video card, hover-to-play service videos
- **Page transitions** — animated route changes
- **Reduced motion** — all animations respect `prefers-reduced-motion`
- **Keyboard accessible** — mobile menu closes with Escape, full tab navigation

---

## License

MIT
