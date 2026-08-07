<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Autonomy (`autonomy.ai`) — Master Agent & Developer Guide

## 1. Project Overview & Core Architecture
Autonomy is a high-performance marketing landing page for an AI business automation platform based in Ireland (Done-For-You service: *"We build automations for your business"*).

- **Framework**: Next.js 15.5.4 (App Router) + React 19.1.1 + TypeScript 5
- **Package Manager**: `pnpm` (v11.9.0)
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (`@import "tailwindcss"`, CSS variables in [`tokens.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/tokens.css))
- **Animation Engine**: Anime.js v4 (`animejs` v4.5.0) + CSS keyframe animations ([`animations.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/animations.css))
- **WebGL**: `ogl` v1.0.11 (dynamically imported for background filaments shader)
- **Icons**: Phosphor Icons (`@phosphor-icons/react` v2.1.7) + Lucide Icons + Inlined SVG sprite ([`src/lib/tools.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/tools.ts))
- **UI System**: Base UI / Radix primitives + shadcn/ui components (`components.json`)
- **Visual QA Engine**: Headless Chrome via `puppeteer-core` v25.4.0

---

## 2. Essential Commands

```bash
pnpm dev                       # Start local dev server (http://localhost:3000)
pnpm build                     # Run Next.js production build
pnpm lint                      # Run ESLint (eslint 9 + next config)
node run-qa.js                 # Run Puppeteer visual QA (6 viewports & section screenshots)
node run-checks-interactive.js  # Run interactive component, state & animation audit
node scratch-qa-runner.js      # Run complete unified QA audit suite
node get-lh-details.js         # Extract Lighthouse performance & web vitals metrics
node get-performance.js        # Audit Chrome DevTools Protocol performance entries
```

---

## 3. Directory Map & Component Responsibilities

| Path | Purpose & Key Contents |
|---|---|
| [`src/app/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/app) | **App Router Root**: [`layout.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/app/layout.tsx) (Inter font setup, metadata, viewport), [`page.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/app/page.tsx) (Main landing page assembling all 15 blocks), [`globals.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/app/globals.css) (Tailwind v4 imports & ambient hero wash). |
| [`src/components/blocks/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks) | **Page Sections & Widgets**: [`hero.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/hero.tsx), [`trust-strip.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/trust-strip.tsx), [`automation-stage.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/automation-stage.tsx), [`what-we-automate.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/what-we-automate.tsx), [`capability-stage.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/capability-stage.tsx), [`capability-grid.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/capability-grid.tsx), [`the-work.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/the-work.tsx), [`time-calculator.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/time-calculator.tsx), [`week-grid.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/week-grid.tsx), [`the-build.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/the-build.tsx), [`integrations.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/integrations.tsx), [`tool-browser.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/tool-browser.tsx), [`tool-sprite.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/tool-sprite.tsx), [`the-choice.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/the-choice.tsx), [`data-sovereignty.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/data-sovereignty.tsx), [`trust-chapter.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/trust-chapter.tsx), [`faq.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/faq.tsx), [`closing-cta.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/closing-cta.tsx), [`capability-widgets/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/capability-widgets). |
| [`src/components/canvas/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas) | **Interactive Flow Canvas Engine**: [`flow-canvas.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/flow-canvas.tsx), [`canvas-node.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/canvas-node.tsx), [`canvas-connectors.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/canvas-connectors.tsx), [`canvas-terminal.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/canvas-terminal.tsx), [`zoom-cluster.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/zoom-cluster.tsx), [`layout.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/layout.ts), [`use-canvas-zoom.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/use-canvas-zoom.ts), [`use-flow-run.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/use-flow-run.ts), [`run-log.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/run-log.tsx), [`constants.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/constants.ts). |
| [`src/components/fx/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx) | **Visual FX & Kinetic Engines**: [`kinetic-grid.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/kinetic-grid.tsx), [`kinetic-grid-engine.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/kinetic-grid-engine.ts), [`kinetic-grid-mount.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/kinetic-grid-mount.tsx), [`logo-wall.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/logo-wall.tsx), [`filaments.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/filaments.tsx), [`glow-card.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/glow-card.tsx), [`hover-button.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/hover-button.tsx), [`count-up.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/count-up.tsx), [`reveal.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/reveal.tsx), [`word-cycle.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/word-cycle.tsx), [`pegtop-loader.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/pegtop-loader.tsx), [`dot-grid.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/dot-grid.tsx). |
| [`src/components/site/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site) | **Shell & Navigation**: [`header.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/header.tsx), [`footer.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/footer.tsx), [`chapter-nav.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/chapter-nav.tsx), [`header-mobile-drawer.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/header-mobile-drawer.tsx), [`icon-3d.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/icon-3d.tsx), [`icon-3d-shapes.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/icon-3d-shapes.ts), [`wordmark.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/wordmark.tsx). |
| [`src/components/ui/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/ui) | **UI Primitives**: [`button.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/ui/button.tsx), [`sheet.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/ui/sheet.tsx), [`slider.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/ui/slider.tsx). |
| [`src/lib/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib) | **Data, Utilities & Hooks**: [`capabilities.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/capabilities.ts) (10 automation jobs data), [`flows.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/flows.ts) (Canvas flows & departments), [`nav.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/nav.ts) (Chapters & dark section IDs), [`tools.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/tools.ts) (58 inlined tool SVG paths), [`use-media.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/use-media.ts), [`use-widget-runner.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/use-widget-runner.ts), [`use-iso-layout-effect.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/use-iso-layout-effect.ts), [`utils.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/utils.ts). |
| [`src/styles/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles) | **Design System & CSS**: [`tokens.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/tokens.css) (CSS variables & Tailwind theme bindings), [`typography.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/typography.css) (Fluid type scale utility classes), [`components.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/components.css) (Shared component classes & glass fallbacks), [`animations.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/animations.css) (Keyframes & reduced motion rules). |
| [`src/types/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/types) | **TypeScript Types**: [`capabilities.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/types/capabilities.ts), [`flows.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/types/flows.ts). |

---

## 4. Design System & CSS Token Architecture ([`src/styles/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles))

### A. Color Palette & Dark Track Hierarchy
- **Primary Accent**: Emerald green (`#3ecf8e` / `var(--primary)`), with `--primary-deep` (`#24b47e`), `--primary-soft` (`#4ade80`), and `--on-primary` (`#06130c`).
  - **CRITICAL**: Primary buttons use dark text (`#06130c` / `var(--on-primary)`), NOT white.
- **Dark Track Surfaces**:
  - `--canvas` (`#0a0b0c`) → Base dark background.
  - `--canvas-soft` (`#101213`) → Off-dark section lift.
  - `--canvas-night` (`#16181a`) → Card container background.
  - `--canvas-night-2` (`#1c1f21`) → Inner canvas frame background.
  - `--canvas-lift` (`#212527`) → Top-level hover surface.
- **Hairlines**: `--hairline` (`#232627`), `--hairline-strong` (`#363b3d`), `--hairline-cool` (`#1b1e1f`).
- **Alpha Tokens**: Pre-computed RGBA tokens (`--primary-a07` through `--primary-a90`, `--white-a04` through `--white-a28`) provide clean glass fills without runtime color calculation.

### B. Tailwind CSS v4 `@theme inline` Integration
Tokens defined in [`tokens.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/tokens.css) are mapped directly into Tailwind via `@theme inline`:
```css
@theme inline {
  --color-primary: var(--primary);
  --color-canvas: var(--canvas);
  --color-canvas-night: var(--canvas-night);
  --color-hairline: var(--hairline);
  --color-ink: var(--ink);
  --radius-sm: 6px;
}
```
**Strict Color Rule**: Color references MUST use CSS variables or Tailwind theme tokens from `tokens.css`. Do NOT hardcode hex values outside `tokens.css`.

### C. Typography Scale ([`typography.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/typography.css))
Inter font (`var(--font-inter)`). Display headings use `font-weight: 500` with tight negative letter-spacing (`-0.03em` on XXL/XL display tiers). Utility classes: `.t-display-xxl` (64px), `.t-display-xl` (48px), `.t-display-lg` (36px), `.t-display-md` (28px), `.t-heading-lg` (22px), `.t-heading-md` (18px), `.t-body-lg` (18px), `.t-body-md` (16px), `.t-button` (14px), `.t-caption` (13px), `.t-micro` (12px), `.t-mono` (tabular code font).

### D. Component Classes & Glass Fallbacks ([`components.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/components.css))
- **Buttons**: Square-ish 6px radius (`--radius-sm` / `rounded-md`). Buttons are NEVER pill-shaped (`rounded-full` is strictly reserved for tags/chips).
- **Glass Effects**: `.glass` and `.site-glass` use `backdrop-filter: blur(28px) saturate(200%)` with explicit `@supports not (backdrop-filter: blur(1px))` fallbacks to `rgba(14, 16, 18, 0.97)`.

### E. Animations & Reduced Motion ([`animations.css`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/styles/animations.css))
Keyframes include `pegtop-rise`, `word-cycle`, `spark-fly`, `spark-pop`, `mote-drift`, `shiny-sweep`, `caption-in`.
Under `prefers-reduced-motion: reduce`:
- Particles (`.chapter-nav__spark`, `.glow-card__motes`, `.shiny-text::after`) are hidden (`display: none`).
- All CSS animations and transitions are forced to `0.001ms !important`.
- Scroll behavior reverts to `auto`.

---

## 5. Interactive Flow Canvas Engine ([`src/components/canvas/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas))

The canvas system visualizes multi-step automated workflows with nodes, connectors, and real-time playback control.

```
FlowCanvas (Root Container)
├── Header Bar (Title, "Automation" pill, Action slot)
└── Canvas Frame Container (ref: zoom.frameRef, 24px dot grid, emerald radial wash)
    ├── World Viewport Layer (translate3d + scale transform)
    │   ├── CanvasConnectors (SVG stroke path drawing & glow)
    │   ├── CanvasTerminal (Kind: "Start", x, y, active)
    │   ├── CanvasNodeCard (Node 0..N, state: "idle" | "running" | "done")
    │   └── CanvasTerminal (Kind: "End", x, y, active)
    └── ZoomCluster (Floating UI pill: -, %, +, fit icon)
```

### A. Layout Math & Modes ([`layout.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/layout.ts))
Node size: `260x116px`, Terminal: `96x96px`, Gap X: `88px`, Row Y: `190px`.
Connectors use cubic Bézier paths: `M p1.x p1.y C p1.x + c p1.y, p2.x - c p2.y, p2.x p2.y`.
- **`serpentine`** (Desktop `#watch-it-run`): 2-row layout (Row A left-to-right, Row B right-to-left). Transition between Node 1 & Node 2 is a direct vertical drop.
- **`stack`** (Mobile under 768px): Vertical single column with `56px` gaps.
- **`cascade`** (Hero preview): 3-node diagonal cascade (`stepX = 92px`, `stepY = 138px`) connected by vertical Béziers (`bendRatio = 0.62`).

### B. Playback State Machine ([`use-flow-run.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/use-flow-run.ts))
Timings: `BASE_RUN = 900ms`, `EDGE_DRAW_MS = 520ms`, `SETTLE_MS = 200ms`, `LOOP_HOLD_MS = 1600ms`.
Driven by high-resolution `requestAnimationFrame` delta time. Evaluates `RunSnapshot` containing `activeIndex`, `doneCount`, `drawingIndex`, `drawnCount`, and `finished`.

### C. Viewport Zoom & Pan ([`use-canvas-zoom.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/use-canvas-zoom.ts))
- **Scale bounds**: `MIN_ZOOM = 0.5`, `MAX_ZOOM = 1.5`, `ZOOM_STEP = 0.1`.
- **Focal-point zoom**: Adjusts `(x, y)` relative to cursor position `(px, py)` so the pixel under mouse remains stationary.
- **Pinch & Drag**: Supports touch pinch via `PointerEvent` distance ratio and primary button mouse drag panning.
- **Fit modes**: `none` (scale 1), `width`, `contain`. Resets with `0` key or `fit()` call.

---

## 6. Page Blocks & Capability Widgets ([`src/components/blocks/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks))

### Page Sections (`src/app/page.tsx` rendering order)
1. **`Hero` (`hero.tsx`)**: Split-text 3D entrance animation via Anime.js v4, dual CTAs (`#start`, `#watch-it-run`), and `FlowCanvas` cascade preview.
2. **`TrustStrip` (`trust-strip.tsx`)**: 3D flat-clay icon badges (1,000+ tools, 2-6 weeks delivery, EU/Ireland hosting).
3. **`AutomationStage` (`automation-stage.tsx`)**: 1.2s live `orderToInvoice` automation run, real-time `RunLog` terminal feed, step timer, and replay button. Auto-arms when 40% in view.
4. **`WhatWeAutomate` (`what-we-automate.tsx`)**: Department switcher (Finance, Sales, Operations, Support, HR, Management) with animated active tab pill and `CapabilityStage` loader.
5. **`CapabilityGrid` (`capability-grid.tsx`)**: 6 core system traits with 3D cursor tilt physics (`rotateX/Y` up to ±9°) via Anime.js `createAnimatable` and unhovered card focus dimming.
6. **`TheWork` (`the-work.tsx`)**: 4 cards breaking down unautomated work costs (Time, Cost, Quality, Communication) with staggered `Reveal` triggers.
7. **`TimeCalculator` (`time-calculator.tsx`)**: Interactive Radix sliders (Headcount 1-50, Frequency 1-100/day, Duration 1-60m) calculating monthly/yearly time & money saved. Renders 40-block `WeekGrid`.
8. **`TheBuild` (`the-build.tsx`)**: 4-step implementation timeline (Map, Scope, Build, Run) with scroll-scrubbed progress line (`--rail` CSS variable).
9. **`Integrations` (`integrations.tsx`)**: Tools showcase hero housing stat counters and embedded `ToolBrowser`.
10. **`TheChoice` (`the-choice.tsx`)**: Comparison cards ("Hire person", "Buy tool", "Build system") with `GlowCard` spotlighting.
11. **`DataSovereignty` (`data-sovereignty.tsx`)**: Security hop diagram (Your systems → Autonomy Ireland → Your systems) with scroll-triggered SVG path draw animation.
12. **`TrustChapter` (`trust-chapter.tsx`)**: 4 legal guarantees (EU hosting, EU AI processing, client ownership, scoped access).
13. **`Faq` (`faq.tsx`)**: Accessible 7-question accordion using CSS grid 0fr/1fr smooth height expansion.
14. **`ClosingCta` (`closing-cta.tsx`)**: Primary lead intake form with `WordCycle` prompt hints and instant confirmation state.

### Interactive Capability Widgets (`src/components/blocks/capability-widgets/`)
Driven by `useRunner` cadence (`850ms` AI think delay, `900ms` step interval, `2800ms` completion hold):
- `ChatWidget`: Multi-channel chat simulation (`whatsapp`, `telegram`, `web`) with cards and option chips.
- `InvoiceWidget`: Document generation and Stripe payment link stamp.
- `ExtractWidget`: PDF email extraction into structured Xero fields.
- `RecordWidget`: Incoming web lead classification, enrichment chips, and Slack rep routing.
- `StockWidget`: Inventory level progress bars vs reorder thresholds and purchase order drafting.
- `ChecklistWidget`: Multi-system onboarding task provisioning progress bar.
- `ReportWidget`: 2x2 metric report card with directional indicators and executive summary note.

---

## 7. Visual FX Engines & 3D Vector System ([`src/components/fx/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx))

### A. KineticGrid Engine ([`kinetic-grid-engine.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/kinetic-grid-engine.ts))
Canvas grid warping engine. Cursor position is smoothed via lerp (`lerpN` speed 0.08). Grid points within `260px` radius displace up to `24px` (`MAX_WARP`), constrained by a cubic polynomial edge pin (`colPin³ * rowPin³`). Clicking triggers expanding ripples (`400px/s` expansion) that deflect nearby nodes. Lines lerp between base hairline and primary emerald. Pauses via `IntersectionObserver` when offscreen.

### B. LogoWall 3D Perspective ([`logo-wall.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/logo-wall.tsx))
3D plane pitched 12° and turned 10°. Columns drift continuously at distinct speeds derived from a golden-ratio algorithm. Mouse parallax smoothly damps via exponential decay (`1 - exp(-dt / 0.12)`). Uses `document.elementFromPoint` hit-testing so hovered tiles lift (`translateZ`) and ease their column speed to 0.

### C. WebGL Filaments Shader ([`filaments.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/filaments.tsx))
Uses `ogl` WebGL engine to render 40 organic flowing filaments. Dynamically loaded via `useNearViewport` (`300px` root margin). Evaluates CSS `--primary` color token into GLSL uniforms. Uses 2D Perlin noise to accumulate filament lines. Explicitly destroys WebGL context on unmount to prevent GPU memory leaks.

### D. GlowCard 3D Spotlight ([`glow-card.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/glow-card.tsx))
Tracks pointer offsets into `--pointer-x` and `--pointer-y` CSS variables. Creates a 1px illuminated border using `mask-composite: exclude` over a radial gradient. Renders 8 drifting motes generated deterministically to avoid SSR hydration mismatches.

### E. 3D Flat-Clay Vector System ([`icon-3d.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/icon-3d.tsx))
19 custom feature icons built with 100% SVG vector shapes set at a 15° isometric orthographic camera angle. Double-layered top face (`d * 0.26` lift) produces physical clay block depth without heavy 3D mesh files.

### F. Header & ChapterNav Mechanics ([`header.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/header.tsx), [`chapter-nav.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/chapter-nav.tsx))
- **Header**: 1px sentinel `IntersectionObserver` toggles `scrolled = true` past 12px, shrinking height (`60px` -> `52px`) and turning background to frosted glass (`backdrop-filter: blur(28px)`). Uses Anime.js v4 `onScroll` to scrub the progress hairline.
- **ChapterNav**: Active link geometry (`offsetLeft`, `offsetWidth`) is measured in `useLayoutEffect` to slide the emerald lit pill via CSS linear spring (`var(--ease-spring)`). Switching chapters spawns 10 `.chapter-nav__spark` elements radiating along trigonometric vectors.
- **Dark Section Inversion**: When header overlaps dark islands (`#watch-it-run`, `#what-we-connect`, `#your-data`), sets `data-dark="true"`, cleanly inverting nav text and logo contrast.

---

## 8. Tool SVG Sprite & Bundle Protection Architecture

### Data & Index Isolation ([`src/lib/tools.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/tools.ts))
Contains 58 inlined brand tool SVGs. To prevent the ~123KB SVG string payload from bloating interactive search and logo wall bundles, `tools.ts` exports two separate entities:
1. `tools`: Full array of `{ name, slug, viewBox, body }`.
2. `toolIndex`: Lightweight array of `{ name, slug }` ONLY.

### Sprite Injection & Consumption
- Root [`page.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/app/page.tsx) renders [`ToolSprite`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/tool-sprite.tsx), mounting an absolute hidden SVG with `<symbol id="tool-{slug}">` definitions.
- [`Integrations`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/integrations.tsx) passes `toolIndex` to [`ToolBrowser`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/tool-browser.tsx) and [`LogoWall`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/logo-wall.tsx).
- Icons render everywhere via lightweight `<use href="#tool-slug">` (`ToolMark`).
- **Result**: Zero runtime icon network requests and zero bundle duplication.

---

## 9. Custom Hooks & Utilities ([`src/lib/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib))

- **`useMediaQuery(query)`** ([`use-media.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/use-media.ts)): Listens to `window.matchMedia` state changes.
- **`useReducedMotion()`**: Returns `true` if `prefers-reduced-motion: reduce` is active.
- **`useNearViewport(ref, margin)`**: Uses `IntersectionObserver` with custom root margin to trigger one-shot lazy loading (e.g. WebGL shader init).
- **`useRunner(steps, thinksAt)`** ([`use-widget-runner.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/use-widget-runner.ts)): Async step animation loop for capability widgets (`850ms` think, `900ms` step, `2800ms` hold). Instantly returns `shown = steps` if reduced motion is enabled.
- **`useIsoLayoutEffect`** ([`use-iso-layout-effect.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/use-iso-layout-effect.ts)): Resolves to `useLayoutEffect` on browser and `useEffect` on SSR to eliminate Next.js hydration warnings.

---

## 10. Configs & Build Optimizations

- **[`next.config.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/next.config.ts)**: Uses `experimental.optimizePackageImports: ["@phosphor-icons/react", "animejs"]` to enable per-export tree-shaking on Phosphor icons and Anime.js barrel files.
- **[`components.json`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/components.json)**: shadcn base-nova setup pointing CSS to `src/app/globals.css` and icon library to Phosphor.
- **[`tsconfig.json`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/tsconfig.json)**: Configured with `moduleResolution: "bundler"` and `@/*` mapping to `./src/*`.
- **[`eslint.config.mjs`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/eslint.config.mjs)**: ESLint 9 Flat Config using `FlatCompat` to bridge `eslint-config-next`.

---

## 11. Automated QA & Visual Inspection Suite

The codebase contains a full programmatic visual testing suite using `puppeteer-core`:
- **`run-qa.js`**: Launches Chrome, takes full-page screenshots across 6 viewports (`320`, `375`, `768`, `1024`, `1440`, `1920`), takes 14 individual section screenshots, and programmatically audits DOM elements (verifying single H1, checking icon plate sizes, ensuring green buttons use dark text `#06130c`, and checking heading weights < 600).
- **`run-checks-interactive.js`**: Audits header scroll attributes (`data-scrolled`, `data-dark`), active chapter pill positions, hero column proportions, `#watch-it-run` caption timelines over 9s, department tab switching, slider calculation output, tool search filtering, FAQ accordion toggling, and reduced-motion emulation.
- **`scratch-qa-runner.js`**: Combined headless QA runner saving complete JSON reports to `qa-screenshots/scratch-audit-results.json`.
- **`get-lh-details.js` & `get-performance.js`**: Extracts Lighthouse Core Web Vitals and Chrome DevTools Protocol performance entries.

---

## 12. Targeted Developer Guide for Code Modifications

- **Updating Copy or Automation Capabilities**:
  - Edit [`src/lib/capabilities.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/capabilities.ts) for the 10 job cards, widget data, and department tools.
  - Edit [`src/lib/flows.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/flows.ts) for flow nodes, step durations, and execution log lines.
  - Edit section blocks in [`src/components/blocks/`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks).
- **Adding / Modifying Brand Tools**:
  - Add or update SVG definitions in [`src/lib/tools.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/lib/tools.ts). They will automatically register in [`ToolSprite`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/tool-sprite.tsx), [`ToolBrowser`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/blocks/tool-browser.tsx), and [`LogoWall`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/logo-wall.tsx).
- **Modifying Flow Canvas Node Rendering & Connectors**:
  - Node layout & Bézier math: [`layout.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/layout.ts).
  - Playback engine: [`use-flow-run.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/use-flow-run.ts).
  - SVG Connector paths: [`canvas-connectors.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/canvas-connectors.tsx).
  - Zoom & Pan controls: [`use-canvas-zoom.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/canvas/use-canvas-zoom.ts).
- **Tweaking Visual Effects**:
  - Canvas grid warping: [`kinetic-grid-engine.ts`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/kinetic-grid-engine.ts).
  - WebGL filaments: [`filaments.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/filaments.tsx).
  - 3D Logo Wall: [`logo-wall.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/logo-wall.tsx).
  - GlowCard spotlight: [`glow-card.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/fx/glow-card.tsx).
- **Header & Navigation Mechanics**:
  - Scroll sentinel & theme inversion: [`header.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/header.tsx).
  - Lit pill & spark particles: [`chapter-nav.tsx`](file:///c:/Users/PC/Desktop/autonomy.ai/claude%20%28first%20try%29/src/components/site/chapter-nav.tsx).

---

## 13. Rules & Non-Negotiable Constraints

1. **Next.js Agent Block**: Always preserve the `<!-- BEGIN:nextjs-agent-rules -->` block at the top of `AGENTS.md`.
2. **No Scroll Hijacking**: Standard native browser scrolling only.
3. **Sole JS Motion Engine**: Anime.js v4 (`animejs`) is the only primary JavaScript animation engine.
4. **Strict Color Token Usage**: All colors must reference CSS variables or Tailwind tokens from `tokens.css`. Never use raw hex values outside `tokens.css`.
5. **Button Radius Rule**: Buttons use 6px square-ish radius (`--radius-sm`). Pill shapes (`rounded-full`) are reserved for chips/tags.
6. **Primary Button Text**: Primary green buttons (`#3ecf8e`) MUST use dark text (`#06130c` / `var(--on-primary)`), NOT white.
7. **Accessibility & Reduced Motion**: Respect `prefers-reduced-motion: reduce` across CSS animations and JS effect triggers.
8. **Fact Integrity**: Marketing copy must adhere to confirmed facts (Done-for-you service, hosted in Ireland, 1,000+ tools connected, 2–6 weeks build time). Never invent client quotes or fake case studies.
