"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

import { FeatureIcon } from "@/components/feature-icon";
import { cn } from "@/lib/utils";

const steps = [
  { name: "Map", copy: "We sit with the people doing the work and draw the process as it really runs.", time: "1 hour", icon: "map-trifold-duotone" },
  { name: "Scope", copy: "We pick the smallest change with the largest return and agree the number we are judged on.", time: "1 week", icon: "crosshair-duotone" },
  { name: "Build", copy: "We build inside your existing tools and test it on sample data before it touches anything live.", time: "2 to 6 weeks", icon: "wrench-duotone" },
  { name: "Run", copy: "We watch it, fix what breaks, and report what it saved you.", time: "Ongoing", icon: "play-circle-duotone" },
];

export function BuildProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? steps.length : 1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.max(1, Math.min(steps.length, Math.ceil(value * steps.length)));
    setActive((current) => current === next ? current : next);
  });
  return (
    <div ref={ref} className="relative mt-14">
      <div className="absolute left-7 right-7 top-7 hidden h-px bg-hairline-strong md:block"><motion.div className="h-full origin-left bg-brand" style={{ scaleX: reduce ? 1 : scale }} /></div>
      <div className="absolute bottom-5 left-7 top-7 w-px bg-hairline-strong md:hidden"><motion.div className="w-full origin-top bg-brand" style={{ height: reduce ? "100%" : `${active / steps.length * 100}%` }} /></div>
      <div className="grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, index) => (
          <div key={step.name} className={cn("relative grid grid-cols-[56px_1fr] gap-4 transition-opacity duration-500 md:block", active > index ? "opacity-100" : "opacity-45")}>
            <FeatureIcon name={step.icon} />
            <div className="md:mt-6">
              <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">{step.name}</h3><span className="text-xs font-semibold text-brand-strong">{step.time}</span></div>
              <p className="mt-3 text-sm leading-6 text-body">{step.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
