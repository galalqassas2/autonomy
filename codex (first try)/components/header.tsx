"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

import { BrandMark } from "@/components/brand-mark";
import { LeadButton } from "@/components/lead-dialog";
import { cn } from "@/lib/utils";

const links = [
  ["The work", "#work"],
  ["Your time", "#time"],
  ["What we connect", "#reach"],
  ["Your data", "#trust"],
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 12));

  useEffect(() => {
    const trust = document.getElementById("trust");
    if (!trust) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOverDark(entry.isIntersecting),
      { rootMargin: "-12px 0px -90% 0px", threshold: 0 },
    );
    observer.observe(trust);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-30 px-3 sm:px-5">
      <div
        className={cn(
          "glass-surface pointer-events-auto mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-[14px] border px-3 transition-[height,background-color,border-color,box-shadow,color] duration-300 sm:px-4",
          scrolled ? "h-[52px] border-ink/[0.06] bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_28px_-18px_rgba(12,21,18,0.28)] backdrop-blur-[20px] backdrop-saturate-[1.8]" : "h-[60px] border-transparent bg-transparent",
          overDark && scrolled ? "border-white/10 bg-ink/70 text-white" : "text-ink",
        )}
      >
        <a href="#top" className="flex min-h-11 items-center gap-2.5 rounded-[10px] pr-2 font-semibold tracking-[-0.02em]" aria-label="Autonomy home">
          <BrandMark />
          <span className="hidden sm:inline">Autonomy</span>
        </a>
        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href} className={cn("rounded-md px-1 py-3 transition-colors", overDark && scrolled ? "text-white/70 hover:text-white" : "text-body hover:text-ink")}>{label}</a>
          ))}
        </nav>
        <LeadButton size="sm" className="h-10 min-h-10 px-3 text-[0.78rem] sm:px-4 sm:text-sm">
          <span className="sm:hidden">Start automation</span>
          <span className="hidden sm:inline">Start your first automation</span>
        </LeadButton>
      </div>
    </header>
  );
}
