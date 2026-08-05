import React, { useEffect, useRef } from 'react';
import { splitText, createTimeline, stagger, spring, createScope, utils } from 'animejs';

interface AnimatedHeroProps {
  title?: string;
  subtitle?: string;
}

export function ReactAnimeTemplate({
  title = "Next-Gen UI Motion",
  subtitle = "High-performance spring physics driven by Anime.js v4"
}: AnimatedHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    // Use Scope to handle media queries and clean up on component unmount
    const scope = createScope({
      root: containerRef.current,
      mediaQueries: {
        reducedMotion: '(prefers-reduced-motion: reduce)'
      }
    });

    scope.add((self) => {
      if (self.matches.reducedMotion) {
        utils.set(titleRef.current, { opacity: 1 });
        return;
      }

      // Split title text into characters
      const { chars } = splitText(titleRef.current!, { chars: true, words: true });

      const tl = createTimeline({
        defaults: { ease: 'outExpo' }
      });

      tl.add(chars, {
        opacity: [0, 1],
        translateY: ['120%', '0%'],
        rotateX: [-90, 0],
        scale: [0.6, 1],
        delay: stagger(20, { from: 'first' }),
        duration: 900,
        ease: spring({ stiffness: 130, damping: 12 })
      })
      .add('.hero-subtitle', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700
      }, '-=400')
      .add('.hero-card', {
        opacity: [0, 1],
        scale: [0.85, 1],
        translateY: [40, 0],
        delay: stagger(80),
        duration: 800,
        ease: spring({ stiffness: 100, damping: 14 })
      }, '-=400');
    });

    // Cleanup animations on component unmount
    return () => {
      scope.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 perspective-1000">
      <h1 ref={titleRef} className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      <p className="hero-subtitle text-lg md:text-xl text-slate-400 max-w-xl text-center mb-12 opacity-0">
        {subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[1, 2, 3].map((item) => (
          <div key={item} className="hero-card opacity-0 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              0{item}
            </div>
            <h3 className="font-semibold text-xl mb-2 text-slate-200">Interactive Feature</h3>
            <p className="text-slate-400 text-sm">Responsive spring choreography with scope isolation.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
