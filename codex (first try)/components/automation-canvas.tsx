"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export type CanvasStep = {
  label: string;
  type: string;
  icon: string;
  rows: [string, string][];
  delta: string;
};

const defaultSteps: CanvasStep[] = [
  { label: "Order received", type: "TRIGGER", icon: "shopping-bag-open-duotone", rows: [["Source", "Store"], ["Event", "New order"]], delta: "+0.0s" },
  { label: "Check stock", type: "DATA", icon: "table-duotone", rows: [["Lookup", "SKU"], ["Result", "Available"]], delta: "+0.4s" },
  { label: "Write invoice", type: "ACTION", icon: "receipt-duotone", rows: [["Customer", "Matched"], ["Status", "Created"]], delta: "+0.9s" },
  { label: "Tell the team", type: "MESSAGE", icon: "chat-circle-text-duotone", rows: [["Channel", "Orders"], ["Status", "Sent"]], delta: "+1.2s" },
];

export function AutomationCanvas({
  title = "Order to invoice",
  compact = false,
  phase: controlledPhase,
  showLog = true,
  className,
}: {
  title?: string;
  compact?: boolean;
  phase?: number;
  showLog?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const steps = compact ? defaultSteps.slice(0, 3) : defaultSteps;
  const [loopPhase, setLoopPhase] = useState(0);

  useEffect(() => {
    if (controlledPhase !== undefined || reduceMotion) return;
    const timer = window.setInterval(() => {
      setLoopPhase((current) => (current >= steps.length + 2 ? 0 : current + 1));
    }, 1050);
    return () => window.clearInterval(timer);
  }, [controlledPhase, reduceMotion, steps.length]);

  const phase = reduceMotion ? steps.length : controlledPhase ?? loopPhase;
  const completed = Math.min(phase, steps.length);
  const pathProgress = Math.max(0, Math.min(1, (phase + 0.3) / steps.length));

  return (
    <div className={cn("overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_24px_56px_-20px_rgba(12,21,18,0.16)]", compact && "animate-canvas-in", className)}>
      <div className="flex h-14 items-center justify-between gap-4 border-b border-hairline px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[0.64rem] font-semibold tracking-[0.11em] text-brand-strong">AUTOMATION</span>
          <strong className="truncate text-sm font-semibold text-ink sm:text-base">{title}</strong>
        </div>
        {controlledPhase === undefined ? (
          <Button variant="secondary" size="sm" className="h-9 min-h-9 rounded-full px-3" onClick={() => setLoopPhase(0)} aria-label="Restart automation">
            <Icon name="play-fill" size={14} aria-hidden />
            <span className="hidden sm:inline">Run</span>
          </Button>
        ) : (
          <span className="flex h-9 items-center gap-2 rounded-full border border-hairline bg-white px-3 text-sm font-semibold text-body">
            <span className="size-1.5 rounded-full bg-running" /> Live run
          </span>
        )}
      </div>
      <div className={cn("canvas-grid relative p-4 sm:p-6", compact ? "min-h-[310px]" : "min-h-[380px]")}> 
        <div className="relative mx-auto hidden h-[230px] w-full items-center md:flex">
          <svg className="pointer-events-none absolute inset-x-[5%] top-1/2 h-24 w-[90%] -translate-y-1/2" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 12 50 C 120 50, 120 50, 250 50 S 380 50, 500 50 S 630 50, 750 50 S 875 50, 988 50" fill="none" stroke="var(--hairline-2)" strokeWidth="2" />
            <path
              d="M 12 50 C 120 50, 120 50, 250 50 S 380 50, 500 50 S 630 50, 750 50 S 875 50, 988 50"
              fill="none"
              pathLength="100"
              stroke={phase < steps.length ? "var(--running)" : "var(--brand)"}
              strokeDasharray="100"
              strokeDashoffset={100 - pathProgress * 100}
              strokeLinecap="round"
              strokeWidth="3"
              style={{ transition: "stroke-dashoffset 400ms var(--ease-out), stroke 300ms ease" }}
            />
          </svg>
          <div className={cn("relative grid w-full items-center gap-3", compact ? "grid-cols-[68px_repeat(3,minmax(0,1fr))_68px]" : "grid-cols-[68px_repeat(4,minmax(0,1fr))_68px]")}> 
            <Terminal type="START" state="done" />
            {steps.map((step, index) => <StepNode key={step.label} step={step} state={phase === index ? "running" : completed > index ? "done" : "idle"} />)}
            <Terminal type="END" state={completed >= steps.length ? "done" : "idle"} />
          </div>
        </div>

        <div className="relative flex flex-col gap-3 md:hidden">
          <div className="absolute bottom-[35px] left-[25px] top-[35px] w-px bg-hairline-strong" />
          <Terminal type="START" state="done" mobile />
          {steps.map((step, index) => <StepNode key={step.label} step={step} state={phase === index ? "running" : completed > index ? "done" : "idle"} mobile />)}
          <Terminal type="END" state={completed >= steps.length ? "done" : "idle"} mobile />
        </div>

        <div className="absolute bottom-3 right-3 hidden h-10 items-center rounded-full border border-hairline bg-white p-1 shadow-sm sm:flex" aria-hidden="true">
          {["minus", `${compact ? "88" : "100"}%`, "plus", "corners-out"].map((item) => (
            item.endsWith("%") ? <span key={item} className="min-w-11 text-center text-xs font-semibold text-muted">{item}</span> :
            <span key={item} className="grid size-8 place-items-center text-body"><Icon name={item} size={15} aria-hidden /></span>
          ))}
        </div>
      </div>
      {showLog && <RunLog steps={steps} visible={completed} />}
    </div>
  );
}

function Terminal({ type, state, mobile }: { type: "START" | "END"; state: "idle" | "done"; mobile?: boolean }) {
  return (
    <div className={cn("relative z-[1] grid place-items-center rounded-[18px] border bg-white text-center shadow-[0_0_0_8px_rgba(12,21,18,0.035)]", mobile ? "ml-0 h-[70px] w-[52px]" : "size-[68px]", state === "done" ? "border-brand/40" : "border-hairline")}>
      {type === "START" ? <BrandMark className="size-7" /> : <Icon name="flag-checkered-duotone" size={25} className={state === "done" ? "text-brand-strong" : "text-muted"} aria-hidden />}
      {!mobile && <span className="absolute -bottom-7 text-[0.58rem] font-semibold tracking-[0.12em] text-muted">{type}</span>}
    </div>
  );
}

function StepNode({ step, state, mobile }: { step: CanvasStep; state: "idle" | "running" | "done"; mobile?: boolean }) {
  return (
    <div data-state={state} className={cn("relative z-[1] min-w-0 overflow-hidden rounded-[14px] border border-hairline bg-white shadow-[0_4px_12px_rgba(12,21,18,0.06)] transition-[transform,border-color] duration-300", mobile && "ml-[70px]", state === "running" && "border-running/40 -translate-y-1", state === "done" && "border-brand/25")}>
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", state === "running" ? "bg-running" : state === "done" ? "bg-brand" : "bg-hairline")} />
      <div className={cn("flex min-h-10 items-center justify-between gap-2 border-b border-hairline px-3", state === "running" ? "bg-running-tint" : state === "done" ? "bg-brand-tint" : "bg-surface")}>
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("state-dot", state === "running" && "animate-status")} />
          <span className="truncate text-[0.61rem] font-semibold tracking-[0.08em] text-body">{step.type}</span>
        </div>
        <Icon name={step.icon} size={16} className={state === "done" ? "text-brand-strong" : state === "running" ? "text-running-strong" : "text-muted"} aria-hidden />
      </div>
      <div className="p-3">
        <strong className="block truncate text-xs font-semibold text-ink sm:text-sm">{step.label}</strong>
        <div className="mt-2 flex flex-col gap-1.5">
          {step.rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2 text-[0.64rem] leading-4">
              <span className="text-muted">{label}</span><span className="truncate font-medium text-body">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RunLog({ steps, visible }: { steps: CanvasStep[]; visible: number }) {
  return (
    <div className="hidden border-t border-hairline bg-white px-4 py-3 sm:block sm:px-5">
      <div className="mb-2 flex items-center gap-2 text-[0.67rem] font-semibold tracking-[0.08em] text-muted"><Icon name="terminal-window" size={14} aria-hidden /> RUN LOG</div>
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div key={step.label} className={cn("grid grid-cols-[46px_1fr_auto] items-center gap-2 border-t border-hairline/70 py-1.5 text-[0.68rem] transition-[opacity,transform] duration-300", visible > index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-25")}>
            <span className="tabular-nums text-muted">00:0{index}</span>
            <span className="truncate text-body">{visible > index ? `${step.label} completed` : `${step.label} queued`}</span>
            <span className="rounded-full bg-brand-tint px-2 py-0.5 font-semibold tabular-nums text-brand-strong">{step.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const automationSteps = defaultSteps;
