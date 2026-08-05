#!/usr/bin/env python3
"""
Anime.js v4 Code Generator Helper Script
Usage: python scripts/anime_code_generator.py --type <hero|tilt|scramble|svg|scroll|flip|draggable>
"""

import sys
import argparse

TEMPLATES = {
    'hero': """// Kinetic Typography Hero Animation (Anime.js v4)
import { splitText, createTimeline, stagger, spring } from 'animejs';

const { chars } = splitText('.hero-title', { chars: true, words: true });

const tl = createTimeline({ defaults: { ease: 'outExpo' } });

tl.add(chars, {
  opacity: [0, 1],
  translateY: ['120%', '0%'],
  rotateX: [-90, 0],
  scale: [0.5, 1],
  delay: stagger(25, { from: 'first' }),
  duration: 1000,
  ease: spring({ stiffness: 140, damping: 12 })
})
.add('.hero-sub', { opacity: [0, 1], translateY: [20, 0], duration: 700 }, '-=500');
""",
    'tilt': """// 3D Pointer Reactive Tilt (Anime.js v4)
import { createAnimatable, utils } from 'animejs';

const [ $card ] = utils.$('.card');

const driver = createAnimatable($card, {
  rotateX: { value: 0, unit: 'deg' },
  rotateY: { value: 0, unit: 'deg' },
  scale: { value: 1 }
});

$card.addEventListener('pointermove', (e) => {
  const rect = $card.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  driver.rotateX(utils.mapRange(-y, -rect.height/2, rect.height/2, -15, 15));
  driver.rotateY(utils.mapRange(x, -rect.width/2, rect.width/2, -15, 15));
  driver.scale(1.05);
});

$card.addEventListener('pointerleave', () => {
  driver.rotateX(0);
  driver.rotateY(0);
  driver.scale(1);
});
""",
    'scramble': """// Cyberpunk Matrix Text Scramble (Anime.js v4)
import { scrambleText } from 'animejs';

scrambleText('.scramble-target', {
  text: 'SYSTEM ONLINE',
  chars: '!@#$%^&*()_+-=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  duration: 1500,
  revealDelay: 200,
  settleDuration: 400
});
""",
    'svg': """// SVG Path Tracing Line Draw (Anime.js v4)
import { createDrawable, animate } from 'animejs';

const drawable = createDrawable('path.vector');

animate(drawable, {
  draw: ['0% 0%', '0% 100%'],
  duration: 2000,
  ease: 'inOutCubic'
});
""",
    'scroll': """// 1:1 Scroll Progress Observer (Anime.js v4)
import { onScroll, animate } from 'animejs';

animate('.parallax-target', {
  scale: [0.8, 1.1],
  opacity: [0, 1],
  autoplay: onScroll({
    target: '.scroll-container',
    axis: 'y',
    enter: 'top 80%',
    leave: 'bottom 20%',
    sync: true
  })
});
""",
    'flip': """// FLIP Layout Grid Reordering (Anime.js v4)
import { createLayout } from 'animejs';

const layout = createLayout('.grid', {
  children: '.card',
  duration: 600,
  ease: 'outExpo'
});

layout.record();
document.querySelector('.grid').classList.toggle('active');
layout.animate();
""",
    'draggable': """// Touch / Mouse Draggable Physics (Anime.js v4)
import { createDraggable, utils } from 'animejs';

createDraggable('.drag-target', {
  x: { snap: 50 },
  y: { snap: 50 },
  container: '.bounds',
  releaseStiffness: 200,
  releaseDamping: 15
});
"""
}

def main():
    parser = argparse.ArgumentParser(description="Anime.js Code Snippet Generator")
    parser.add_argument("--type", choices=list(TEMPLATES.keys()), default="hero", help="Type of animation snippet")
    args = parser.parse_args()

    print(TEMPLATES[args.type])

if __name__ == "__main__":
    main()
