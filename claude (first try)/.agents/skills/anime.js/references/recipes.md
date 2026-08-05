# Production Animation Recipes (Anime.js v4)

This file contains copy-pasteable, battle-tested animation recipes for high-end web applications.

---

## 1. 3D Card Hover & Tilt Physics

Creates a responsive 3D card tilt effect that responds to pointer movement and snaps back with spring physics when pointer leaves.

```javascript
import { createAnimatable, spring, utils } from 'animejs';

export function setup3DCardTilt(cardSelector) {
  const [ $card ] = utils.$(cardSelector);
  if (!$card) return;

  const animatable = createAnimatable($card, {
    rotateX: { value: 0, unit: 'deg' },
    rotateY: { value: 0, unit: 'deg' },
    scale: { value: 1 }
  });

  $card.addEventListener('pointermove', (e) => {
    const rect = $card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = utils.mapRange(-y, -rect.height / 2, rect.height / 2, -15, 15);
    const rotY = utils.mapRange(x, -rect.width / 2, rect.width / 2, -15, 15);

    animatable.rotateX(rotX);
    animatable.rotateY(rotY);
    animatable.scale(1.04);
  });

  $card.addEventListener('pointerleave', () => {
    animatable.rotateX(0);
    animatable.rotateY(0);
    animatable.scale(1);
  });
}
```

---

## 2. Kinetic Typography Hero Sequence

Splits an H1 text into words & characters and orchestrates a staggered 3D entrance.

```javascript
import { splitText, createTimeline, stagger, spring } from 'animejs';

export function animateKineticHero(headingSelector, ctaSelector) {
  const { chars } = splitText(headingSelector, {
    chars: true,
    words: true,
    accessible: true
  });

  const tl = createTimeline({
    defaults: { ease: 'outExpo' }
  });

  tl.add(chars, {
    opacity: [0, 1],
    translateY: ['140%', '0%'],
    rotateX: [-100, 0],
    rotateZ: [-10, 0],
    scale: [0.3, 1],
    delay: stagger(20, { from: 'first' }),
    duration: 900,
    ease: spring({ stiffness: 120, damping: 11 })
  })
  .add(ctaSelector, {
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [20, 0],
    duration: 700,
    ease: 'outBack'
  }, '-=400');
}
```

---

## 3. Interactive Modal Reveal with FLIP Layout

Expands a small grid thumbnail into a full-screen modal cleanly using `createLayout`.

```javascript
import { createLayout, animate } from 'animejs';

export function setupModalFLIP(gridSelector, modalSelector) {
  const layout = createLayout(gridSelector, {
    children: '.grid-item',
    duration: 600,
    ease: 'outExpo'
  });

  document.querySelectorAll('.grid-item').forEach(($item) => {
    $item.addEventListener('click', () => {
      layout.record();
      $item.classList.toggle('expanded-modal');
      layout.animate();
    });
  });
}
```

---

## 4. Cyberpunk Scramble Button Hover

Reveals a matrix-style scramble text effect on button hover.

```javascript
import { scrambleText } from 'animejs';

export function setupScrambleButton(buttonSelector, targetText) {
  const $btn = document.querySelector(buttonSelector);
  if (!$btn) return;

  $btn.addEventListener('mouseenter', () => {
    scrambleText($btn, {
      text: targetText,
      chars: '!@#$%^&*()_+=10987654321',
      duration: 800,
      revealDelay: 100,
      settleDuration: 250
    });
  });
}
```

---

## 5. Scroll-Driven Progress Line & Parallax Cards

```javascript
import { createDrawable, onScroll, animate, stagger } from 'animejs';

export function setupScrollSection(pathSelector, cardsSelector) {
  // 1. Draw SVG progress line along scroll
  const drawable = createDrawable(pathSelector);

  animate(drawable, {
    draw: ['0% 0%', '0% 100%'],
    autoplay: onScroll({
      target: '.timeline-container',
      axis: 'y',
      enter: 'top center',
      leave: 'bottom center',
      sync: true
    })
  });

  // 2. Parallax card reveals
  animate(cardsSelector, {
    opacity: [0, 1],
    translateY: [80, 0],
    delay: stagger(100),
    autoplay: onScroll({
      target: cardsSelector,
      axis: 'y',
      enter: 'top 85%',
      leave: 'top 30%',
      sync: false
    })
  });
}
```
