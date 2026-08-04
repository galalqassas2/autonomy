"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

import { AutomationCanvas, automationSteps } from "@/components/automation-canvas";
import { LeadButton } from "@/components/lead-dialog";

const captions = [
  "An order arrives from your store.",
  "Stock is checked. Nobody asked it to.",
  "The invoice writes itself.",
  "Your team is told. Elapsed: 1.2 seconds.",
];

export function ScrollStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(automationSteps.length, Math.floor(value * automationSteps.length));
    setPhase((current) => current === next ? current : next);
  });

  if (reduceMotion) {
    return (
      <section id="watch" className="section-pad border-b border-hairline bg-white">
        <div className="shell">
          <div className="section-heading">
            <p className="kicker">Watch it run</p>
            <h2 className="section-title">A process, completed in plain sight.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {captions.map((caption, index) => (
              <div key={caption} className="rounded-[16px] border border-hairline bg-surface p-6">
                <span className="mb-5 grid size-10 place-items-center rounded-[12px] bg-brand-tint font-semibold text-brand-strong">{index + 1}</span>
                <h3 className="text-lg font-semibold text-ink">{caption}</h3>
                <p className="mt-2 text-sm leading-6 text-body">{automationSteps[index].label} completes with a recorded result.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="watch" className="border-b border-hairline bg-white">
      <div ref={ref} className="relative h-[300vh] md:h-[400vh]">
        <div className="sticky top-[82px] flex h-[calc(100dvh-82px)] flex-col justify-center overflow-hidden py-6">
          <div className="shell flex min-h-0 flex-col">
            <div className="mb-5 flex items-end justify-between gap-6">
              <div>
                <p className="kicker mb-2">Watch it run</p>
                <motion.p key={phase} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="max-w-[34ch] text-xl font-semibold tracking-[-0.025em] text-ink sm:text-2xl">
                  {captions[Math.min(phase, captions.length - 1)]}
                </motion.p>
              </div>
              <span className="hidden text-sm font-semibold tabular-nums text-muted sm:block">{Math.min(phase + 1, captions.length)} / {captions.length}</span>
            </div>
            <div className="mb-4 h-0.5 overflow-hidden rounded-full bg-hairline">
              <motion.div className="h-full origin-left bg-brand" style={{ scaleX: progressScale }} />
            </div>
            <AutomationCanvas phase={phase} showLog className="max-h-[calc(100dvh-210px)]" />
          </div>
        </div>
      </div>
      <div className="border-t border-hairline py-14">
        <div className="shell flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-xl font-semibold tracking-[-0.025em] text-ink">That is one process. Most teams have twelve.</p>
          <LeadButton>Start your first automation</LeadButton>
        </div>
      </div>
    </section>
  );
}
