# Anime.js v3 to v4 Migration & Transformation Guide

Anime.js v4 is a major architectural evolution. It moves from a single global function `anime()` to modular, tree-shakeable exports (`animate`, `createTimeline`, `createTimer`, `createAnimatable`, `createScope`, `splitText`, `scrambleText`, `createDrawable`, `createMotionPath`, `morphTo`, `onScroll`, `createLayout`, `createDraggable`, `spring`, `stagger`, `utils`).

---

## Direct Syntax Mapping

### 1. Basic Animation
```javascript
// ❌ Legacy Anime.js v3
anime({
  targets: '.box',
  translateX: 250,
  rotate: '1turn',
  duration: 800,
  easing: 'easeInOutQuad'
});

// ✅ Modern Anime.js v4
import { animate } from 'animejs';

animate('.box', {
  x: 250,                  // 'translateX' -> 'x'
  rotate: '1turn',
  duration: 800,
  ease: 'inOutQuad'        // 'easing' -> 'ease', 'easeInOutQuad' -> 'inOutQuad'
});
```

### 2. Timelines
```javascript
// ❌ Legacy Anime.js v3
var tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});
tl.add({ targets: '.el1', translateX: 250 })
  .add({ targets: '.el2', translateX: 250 }, '-=500');

// ✅ Modern Anime.js v4
import { createTimeline } from 'animejs';

const tl = createTimeline({
  defaults: { ease: 'outExpo', duration: 750 }
});
tl.add('.el1', { x: 250 })
  .add('.el2', { x: 250 }, '-=500');
```

### 3. Staggering
```javascript
// ❌ Legacy Anime.js v3
anime({
  targets: '.item',
  translateX: 270,
  delay: anime.stagger(100, { grid: [14, 5], from: 'center' })
});

// ✅ Modern Anime.js v4
import { animate, stagger } from 'animejs';

animate('.item', {
  x: 270,
  delay: stagger(100, { grid: [14, 5], from: 'center' })
});
```

### 4. Property Name Transformation Table

| v3 Property Name | v4 Property Name | Notes |
| :--- | :--- | :--- |
| `targets` | First argument of `animate(targets, params)` | Targets passed as 1st param |
| `easing` | `ease` | Renamed to `ease` |
| `translateX` | `x` | Shortened transform name |
| `translateY` | `y` | Shortened transform name |
| `translateZ` | `z` | Shortened transform name |
| `rotateX` | `rotateX` | Maintained |
| `rotateY` | `rotateY` | Maintained |
| `scale` | `scale` | Maintained |
| `anime.path()` | `createMotionPath()` | New specialized module |
| `anime.set()` | `utils.set()` | Moved to `utils` namespace |
| `anime.remove()`| `utils.remove()` | Moved to `utils` namespace |
