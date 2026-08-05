---
name: animate.js
description: Complete master skill for Anime.js (v4 & v3) - JavaScript Animation Engine. Use when building high-performance, jaw-dropping web animations, kinetic typography, split-text, text scramble, SVG path drawing/morphing, scroll observers, FLIP layout transitions, 3D spring physics, interactive draggables, and micro-interactions.
---

# Anime.js (v4 & v3) Animation Engine Skill

Anime.js is a lightweight, multipurpose, high-performance JavaScript animation engine. Version 4 introduces a modern, modular API (`animate`, `createTimeline`, `createTimer`, `createAnimatable`, `createScope`, `splitText`, `scrambleText`, `createDrawable`, `createMotionPath`, `morphTo`, `onScroll`, `createLayout`, `createDraggable`, `spring`, `stagger`, `utils`).

This skill provides a complete system for agents to architect and implement **award-winning, 60fps web motion graphics**.

---

## Skill Directory Index & Progressive Disclosure

This skill directory follows the standard modular agent skill specification:

```text
animate.js/
├── SKILL.md                              # Main instruction & progressive disclosure map
├── templates/                            # Ready-to-use HTML & React project boilerplates
│   ├── standalone-anime-template.html    # Standalone ESM HTML5 starter template
│   └── react-anime-template.tsx          # TypeScript React hook component template
├── examples/                             # Standalone runnable HTML/JS task demonstrations
│   ├── 01-hero-kinetic-typography.html   # Kinetic text split & spring entrance
│   ├── 02-3d-card-tilt-hover.html        # Direct driver 3D pointer reactive tilt
│   ├── 03-cyberpunk-text-scramble.html   # Matrix cyberpunk text scramble
│   ├── 04-svg-path-drawing-morphing.html # Vector line drawing & motion path follower
│   ├── 05-scroll-driven-parallax.html    # 1:1 Scroll observer parallax
│   ├── 06-flip-grid-modal-expand.html    # FLIP layout grid reordering
│   └── 07-draggable-cards-physics.html   # Interactive draggable cards with snap physics
├── scripts/                              # CLI utilities for agents
│   └── anime_code_generator.py           # Boilerplate code snippet generator CLI
└── references/                           # Detailed technical documentation
    ├── v4_api_reference.md               # Exhaustive 17-module API reference
    ├── easings_and_springs.md            # Spring physics & easing curves matrix
    ├── v3_to_v4_migration.md             # Anime.js v3 legacy transformation guide
    └── troubleshooting_and_gotchas.md    # Performance, 3D depth, & React cleanup
```

---

## The 5 Golden Rules of Jaw-Dropping UI Motion

1. **Physics Over Linear Curves**: NEVER use `linear` easing for entrances or UI elements. Always use `spring({ stiffness, damping })` or exponential ease-outs (`outExpo`, `outBack`). Linear easing makes UI feel robotic and cheap.
2. **Choreograph with Stagger**: Never animate a group of elements simultaneously. Use `stagger(delay, { from: 'center' | 'first' | grid })` to create organic cascading reveals.
3. **Layered Depth & 3D Spatial Motion**: Combine opacity with scale (`scale: [0.8, 1]`) and 3D transforms (`translateY`, `rotateX`, `rotateZ`). Always set `perspective: 1000px` on parent containers when using 3D rotations.
4. **Performance & Hardware Acceleration**: Animate composite properties (`x`, `y`, `scale`, `rotate`, `opacity`) instead of trigger-heavy layout properties (`top`, `left`, `width`, `height`).
5. **Clean Up & Accessibility**: Respect `prefers-reduced-motion` and clean up inline styles using `utils.cleanInlineStyles()` or `scope.revert()` to prevent CSS layout conflicts.

---

## Critical: Correct CDN / Import

> **IMPORTANT**: Always use `https://esm.sh/animejs` as the CDN URL. This is the **only** CDN that bundles ALL Anime.js v4 sub-modules together (`splitText`, `scrambleText`, `createLayout`, `createDraggable`, `createDrawable`, `createMotionPath`, `morphTo`, `onScroll`, etc.).
>
> **❌ WRONG** (missing sub-modules like splitText):
> ```html
> <script type="importmap">
>   { "imports": { "animejs": "https://cdn.jsdelivr.net/npm/animejs@4.0.0/+esm" } }
> </script>
> ```
>
> **✅ CORRECT**:
> ```html
> <script type="module">
>   import { animate, splitText, stagger, spring } from 'https://esm.sh/animejs';
> </script>
> ```
>
> For Node/bundler projects (Vite, Next.js, Webpack), use `npm install animejs` and import normally from `'animejs'`.

---

## Quick API Overview

### Core Animation (`animate`)
```javascript
import { animate, stagger, spring } from 'animejs';

animate('.card', {
  opacity: [0, 1],
  translateY: [40, 0],
  scale: [0.9, 1],
  delay: stagger(80, { from: 'center' }),
  duration: 800,
  ease: spring({ stiffness: 140, damping: 12 })
});
```

### Timelines (`createTimeline`)
```javascript
import { createTimeline } from 'animejs';

const tl = createTimeline({ defaults: { ease: 'outExpo' } });

tl.add('.badge', { opacity: [0, 1], scale: [0.8, 1] })
  .add('.title', { opacity: [0, 1], y: [30, 0] }, '-=400')
  .add('.cta', { scale: [0, 1], ease: 'outBack' }, '+=200');
```

### Kinetic Typography (`splitText`)
```javascript
import { splitText, animate, stagger } from 'animejs';

const { chars } = splitText('.heading', { chars: true, words: true });

animate(chars, {
  opacity: [0, 1],
  translateY: ['100%', '0%'],
  rotateX: [-90, 0],
  delay: stagger(20),
  duration: 800
});
```

### Cyberpunk Scramble (`scrambleText`)
```javascript
import { scrambleText } from 'animejs';

scrambleText('.label', {
  text: 'SYSTEM ONLINE',
  chars: '0123456789ABCDEF#$@!',
  duration: 1500
});
```

### SVG Line Drawing (`createDrawable`)
```javascript
import { createDrawable, animate } from 'animejs';

const drawable = createDrawable('path.vector');
animate(drawable, { draw: ['0% 0%', '0% 100%'], duration: 2000 });
```

### Scroll Observer (`onScroll`)
```javascript
import { onScroll, animate } from 'animejs';

animate('.parallax-target', {
  scale: [0.8, 1.1],
  opacity: [0, 1],
  autoplay: onScroll({ target: '.section', axis: 'y', sync: true })
});
```

---

## Detailed References & Starter Templates

- **[Starter Boilerplates]**: See [`templates/standalone-anime-template.html`](./templates/standalone-anime-template.html) and [`templates/react-anime-template.tsx`](./templates/react-anime-template.tsx).
- **[Full Runnable Examples]**: Browse 7 task demonstrations in [`examples/`](./examples/).
- **[17-Module API Reference]**: Read [`references/v4_api_reference.md`](./references/v4_api_reference.md).
- **[Spring Physics & Easings]**: Read [`references/easings_and_springs.md`](./references/easings_and_springs.md).
- **[Legacy v3 to v4 Guide]**: Read [`references/v3_to_v4_migration.md`](./references/v3_to_v4_migration.md).
- **[Troubleshooting & Gotchas]**: Read [`references/troubleshooting_and_gotchas.md`](./references/troubleshooting_and_gotchas.md).
- **[CLI Code Generator]**: Run `python scripts/anime_code_generator.py --type <type>`.
