# Anime.js v4 Easings & Spring Physics Reference

## 1. Built-in Easing Functions

Anime.js v4 provides standard easing curves with 4 direction variants: `in`, `out`, `inOut`, and `outIn`.

### Available Built-in Functions
- **Quadratic**: `inQuad`, `outQuad`, `inOutQuad`, `outInQuad`
- **Cubic**: `inCubic`, `outCubic`, `inOutCubic`, `outInCubic`
- **Quart**: `inQuart`, `outQuart`, `inOutQuart`, `outInQuart`
- **Quint**: `inQuint`, `outQuint`, `inOutQuint`, `outInQuint`
- **Sine**: `inSine`, `outSine`, `inOutSine`, `outInSine`
- **Exponential**: `inExpo`, `outExpo`, `inOutExpo`, `outInExpo`
- **Circular**: `inCirc`, `outCirc`, `inOutCirc`, `outInCirc`
- `inBack`, `outBack`, `inOutBack`, `outInBack` (Overshot overshoot curves)
- `inBounce`, `outBounce`, `inOutBounce`, `outInBounce` (Bouncy collision curves)
- `inElastic`, `outElastic`, `inOutElastic`, `outInElastic` (Elastic spring-like curves)

### Power Curves Shorthand
Anime.js v4 supports power curve shorthand strings:
- `'out(3)'`: Equivalent to `outCubic`
- `'inOut(4)'`: Equivalent to `inOutQuart`
- `'in(5)'`: Equivalent to `inQuint`

---

## 2. Spring Physics (`spring`)

Spring physics create fluid, organic motion where duration is derived naturally from mass, stiffness, damping, and initial velocity.

```javascript
import { spring, animate } from 'animejs';

// Define Custom Spring
const softSpring = spring({
  mass: 1,         // Mass of object (higher = heavier momentum)
  stiffness: 120,  // Spring tightness (higher = faster snap)
  damping: 12,     // Oscillation resistance (lower = more bouncy, higher = zero overshoot)
  velocity: 0      // Initial velocity multiplier
});

animate('.modal', {
  scale: [0.7, 1],
  opacity: [0, 1],
  ease: softSpring
});
```

### Spring Presets Matrix
| Preset / Feel | Mass | Stiffness | Damping | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Bouncy Pop** | 1 | 180 | 8 | Badges, CTA button pops, micro-interactions |
| **Smooth UI Entrance** | 1 | 140 | 14 | Card entrances, kinetic typography, modal popups |
| **Heavy Inertia** | 2 | 90 | 18 | Large drawer panels, heavy modal dialogs |
| **Over-damped (No Bounce)**| 1 | 120 | 22 | Clean corporate UI, data table expands |

---

## 3. Custom Bezier & Step Curves

### Cubic Bezier
```javascript
import { cubicBezier, animate } from 'animejs';

animate('.box', {
  x: 200,
  ease: cubicBezier(0.25, 0.1, 0.25, 1.0) // Or string 'cubicBezier(0.25, 0.1, 0.25, 1.0)'
});
```

### Steps Easing
```javascript
import { steps, animate } from 'animejs';

animate('.sprite-sheet', {
  x: '-800px',
  ease: steps(8) // Steps animation for sprite sheets
});
```

---

## 4. Web Animation API Integration (`waapi`)

Convert Anime.js springs and custom easings into native Web Animation API strings for hardware-accelerated animations.

```javascript
import { waapi, spring } from 'animejs';

const mySpring = spring({ stiffness: 150, damping: 10 });

const element = document.querySelector('.native-box');
element.animate({
  transform: ['translateY(100px)', 'translateY(0px)']
}, {
  duration: mySpring.duration,
  easing: waapi.convertEase(mySpring.ease)
});
```
