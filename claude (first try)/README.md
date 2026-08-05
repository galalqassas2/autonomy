# Autonomy

Marketing site for Autonomy — an AI-powered business automation platform based in Ireland.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom design tokens
- **Animation**: [Anime.js v4](https://animejs.com/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Components**: shadcn/ui (Radix primitives)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router (layout, page, global styles)
├── components/
│   ├── blocks/       # Page sections (hero, automation stage, FAQ, etc.)
│   ├── canvas/       # Interactive flow canvas (nodes, connectors, zoom)
│   ├── fx/           # Visual effects (kinetic grid, pegtop loader, reveal)
│   ├── site/         # Shell components (header, footer, wordmark)
│   └── ui/           # Primitives from shadcn (button, sheet, slider)
├── lib/              # Data, hooks, and utilities
├── styles/           # Modular CSS (tokens, typography, components, animations)
└── types/            # Shared TypeScript type definitions
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
