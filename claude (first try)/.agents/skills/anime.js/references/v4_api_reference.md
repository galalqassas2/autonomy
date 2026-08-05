# Anime.js v4 Complete API Reference

## 1. Engine & Configuration (`engine`)

The `engine` object manages the global frame loop, frame rates, and precision defaults.

```javascript
import { engine } from 'animejs';

// Global Engine Settings
engine.defaults.duration = 600;       // Default animation duration (ms)
engine.defaults.ease = 'outExpo';     // Default easing function
engine.fps = 60;                      // Target FPS rate limit
engine.precision = 4;                 // Floating point precision for transform outputs
engine.pauseOnDocumentHidden = true;  // Pause animations when browser tab is inactive
engine.speed = 1.0;                   // Global playback speed multiplier (e.g. 0.5 for half speed)

// Engine Controls
engine.pause();
engine.resume();
```

---

## 2. Animatable Engine (`createAnimatable`)

`createAnimatable` provides a low-level, zero-overhead driver for rapidly mutating properties without timeline overhead. Ideal for 60fps interaction loops and canvas rendering.

```javascript
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.box', {
  x: { value: 0, unit: 'px' },
  opacity: { value: 1 },
  rotate: { value: 0, unit: 'deg' }
});

// Update values directly in requestAnimationFrame
function onPointerMove(px, py) {
  animatable.x(px);
  animatable.rotate(px * 0.1);
}
```

---

## 3. Specialized Text Splitting & Scrambling

### `splitText` Parameters
- `target`: CSS selector or DOM Element.
- `chars` (boolean): Split into individual character `<span>`s.
- `words` (boolean): Split into word `<span>`s.
- `lines` (boolean): Split into line `<span>`s based on bounding rects.
- `wrap` (string): HTML tag used to wrap items (default: `'span'`).
- `class` (string): Custom CSS class added to wrapped elements.
- `accessible` (boolean): Preserve native screen reader reading by keeping original hidden text.

```javascript
import { splitText } from 'animejs';

const { chars, words, lines } = splitText('#hero-heading', {
  chars: true,
  words: true,
  class: 'split-item',
  accessible: true
});
```

### `scrambleText` Parameters
- `text` (string): Target text string to reveal.
- `chars` (string): Character pool used for scrambling (`'upperCase'`, `'lowerCase'`, `'numeric'`, `'symbols'`, or custom string).
- `duration` (number): Total duration of scramble effect (ms).
- `revealDelay` (number): Delay before character revealing begins.
- `settleDuration` (number): Time taken for scrambled chars to lock into final state.
- `perturbation` (number): Amount of random character flipping noise (0 to 1).

```javascript
import { scrambleText } from 'animejs';

scrambleText('.tech-status', {
  text: 'CORE REACTION ONLINE',
  chars: '01010101_#X!',
  duration: 1800,
  revealDelay: 200,
  settleDuration: 400
});
```

---

## 4. SVG Vector Tools (`createDrawable`, `createMotionPath`, `morphTo`)

### Stroke Drawing (`createDrawable`)
Converts an SVG path or shape into a stroke progress animatable object.

```javascript
import { createDrawable, animate } from 'animejs';

const drawPath = createDrawable('path.vector-line');

animate(drawPath, {
  draw: ['0% 0%', '0% 100%'], // Draws path from start to end
  duration: 2000,
  ease: 'inOutCubic'
});
```

### Motion Path Following (`createMotionPath`)
Extracts X/Y position and rotation angles from an SVG path.

```javascript
import { createMotionPath, animate } from 'animejs';

const pathData = createMotionPath('#flight-route');

animate('#airplane', {
  x: pathData('x'),
  y: pathData('y'),
  rotate: pathData('angle'),
  duration: 5000,
  loop: true,
  ease: 'linear'
});
```

### Path Morphing (`morphTo`)
Interpolates SVG `d` path strings smoothly. Paths should ideally have matching node counts for best visual results.

```javascript
import { morphTo, animate } from 'animejs';

animate('path#icon-state', {
  d: morphTo('path#icon-target-state'),
  duration: 800,
  ease: 'outBack'
});
```

---

## 5. Scroll Observer (`onScroll`)

Couples animation playback rate or timeline progress directly to viewport scroll.

```javascript
import { onScroll, animate } from 'animejs';

animate('.scroll-card', {
  opacity: [0, 1],
  translateY: [100, 0],
  rotateX: [15, 0],
  autoplay: onScroll({
    target: '.scroll-card-wrapper',
    container: window,
    axis: 'y',
    enter: 'top 80%',     // Triggers when top of element reaches 80% from top of viewport
    leave: 'bottom 20%',  // Triggers when bottom of element reaches 20% from top
    sync: true,           // Smooth 1:1 scroll progress binding
    onEnter: () => console.log('Entered view'),
    onLeave: () => console.log('Left view')
  })
});
```

---

## 6. FLIP Layout Engine (`createLayout`)

Saves layout snapshots and animates position & size changes when the DOM changes.

```javascript
import { createLayout } from 'animejs';

const layout = createLayout('.flex-container', {
  children: '.card-item',
  duration: 500,
  ease: 'outExpo'
});

// Snapshot initial state
layout.record();

// Perform DOM manipulation (reordering, class toggling, filtering)
document.querySelector('.flex-container').classList.toggle('grid-columns-4');

// Play smooth transition
layout.animate();
```

---

## 7. Interactive Draggables (`createDraggable`)

```javascript
import { createDraggable, utils } from 'animejs';

createDraggable('#slider-handle', {
  x: {
    snap: 50,                // Snap interval along X axis
    modifier: utils.clamp(0, 500) // Restrict dragging between 0 and 500px
  },
  y: false,                   // Lock Y axis
  container: '.slider-track',
  containerPadding: 0,
  releaseMass: 1,
  releaseStiffness: 180,
  releaseDamping: 14,
  onDrag: () => {
    const xPos = utils.get('#slider-handle', 'x');
    document.querySelector('.output').textContent = Math.round(xPos);
  }
});
```

---

## 8. Built-in Easing Functions Reference

### Standard Curves
- `linear`
- `inQuad`, `outQuad`, `inOutQuad`, `outInQuad`
- `inCubic`, `outCubic`, `inOutCubic`, `outInCubic`
- `inQuart`, `outQuart`, `inOutQuart`, `outInQuart`
- `inQuint`, `outQuint`, `inOutQuint`, `outInQuint`
- `inSine`, `outSine`, `inOutSine`, `outInSine`
- `inExpo`, `outExpo`, `inOutExpo`, `outInExpo`
- `inCirc`, `outCirc`, `inOutCirc`, `outInCirc`
- `inBack`, `outBack`, `inOutBack`, `outInBack`
- `inBounce`, `outBounce`, `inOutBounce`, `outInBounce`
- `inElastic`, `outElastic`, `inOutElastic`, `outInElastic`

### Parametric Easings
- `spring({ mass: 1, stiffness: 100, damping: 10, velocity: 0 })`
- `cubicBezier(x1, y1, x2, y2)`
- `steps(numberOfSteps)`
- Custom Function: `ease: (t) => Math.pow(t, 3)`
