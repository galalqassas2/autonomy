# Troubleshooting & Common Gotchas (Anime.js v4)

## 1. 3D Transforms Not Showing Perspective Depth
**Symptom**: `rotateX` or `rotateY` looks flat without 3D depth.
**Cause**: Missing CSS `perspective` on the parent container element.
**Solution**: Always ensure the parent element has perspective set:
```css
.parent-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}
```

---

## 2. Inline Style Conflicts with CSS Hovers
**Symptom**: After animation completes, CSS `:hover` states fail to trigger because inline `transform` or `opacity` overrides CSS classes.
**Cause**: Anime.js sets inline styles directly on the DOM element.
**Solution**: Use `utils.cleanInlineStyles()` in the `onComplete` callback:
```javascript
import { animate, utils } from 'animejs';

animate('.btn', {
  scale: [0.8, 1],
  opacity: [0, 1],
  onComplete: (anim) => utils.cleanInlineStyles(anim.targets)
});
```

---

## 3. Layout Shift / Jank during Entrance Animations
**Symptom**: Page jumps during page load or entrance animations.
**Cause**: Animating layout properties like `top`, `left`, `width`, or `margin` forces CPU layout recalculation.
**Solution**:
- Animate composite transform properties instead: `x`, `y`, `scale`.
- Set initial CSS state to `opacity: 0` or use keyframe arrays: `opacity: [0, 1]`.

---

## 4. React Memory Leaks & Duplicate Animations
**Symptom**: Animations run twice (in React Strict Mode) or linger after page navigation.
**Cause**: Animation timers persist past React component unmounting.
**Solution**: Wrap animations in `createScope()` or store timelines in a ref and revert on cleanup:
```javascript
useEffect(() => {
  const scope = createScope({ root: containerRef.current });
  scope.add(() => {
    animate('.item', { opacity: [0, 1] });
  });
  return () => scope.revert();
}, []);
```

---

## 5. Text Splitting Accessibility (SEO & Screen Readers)
**Symptom**: Screen readers read individual characters as separate words after `splitText`.
**Cause**: Wrapping characters in `<span>` tags breaks text accessibility tree.
**Solution**: Enable `accessible: true` option in `splitText`:
```javascript
const { chars } = splitText('.heading', {
  chars: true,
  accessible: true // Keeps hidden original text for screen readers
});
```
