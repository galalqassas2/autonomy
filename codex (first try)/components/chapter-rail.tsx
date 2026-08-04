"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const chapters = [
  ["Watch it run", "watch"],
  ["The work", "work"],
  ["Your time", "time"],
  ["What we connect", "reach"],
  ["Your data", "trust"],
];

export function ChapterRail() {
  const [active, setActive] = useState("watch");
  const rail = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const elements = chapters.map(([, id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    rail.current?.querySelector<HTMLElement>(`[data-chapter="${active}"]`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [active, reduceMotion]);

  return (
    <nav className="glass-surface sticky top-[72px] z-20 border-y border-hairline bg-white/88 backdrop-blur-[18px]" aria-label="Page chapters">
      <div ref={rail} className="shell scrollbar-none flex items-center gap-1 overflow-x-auto py-2">
        {chapters.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            data-chapter={id}
            aria-current={active === id ? "location" : undefined}
            className={cn("flex min-h-11 shrink-0 items-center rounded-[10px] px-4 text-sm font-semibold transition-colors", active === id ? "bg-brand-tint text-brand-strong" : "text-muted hover:bg-surface hover:text-ink")}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
