"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon as IconifyIcon } from "@iconify/react";

import { AutomationCanvas } from "@/components/automation-canvas";
import { FeatureIcon } from "@/components/feature-icon";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Job = { name: string; channel: string; type: "conversation" | "canvas"; icon: string; brand?: string };

const jobs: Job[] = [
  { name: "Answer a customer question", channel: "WhatsApp", type: "conversation", icon: "chats-circle-duotone", brand: "logos:whatsapp-icon" },
  { name: "Qualify a new lead", channel: "Web form", type: "canvas", icon: "funnel-duotone" },
  { name: "Issue an invoice", channel: "QuickBooks", type: "canvas", icon: "receipt-duotone", brand: "logos:quickbooks" },
  { name: "Chase an unpaid invoice", channel: "Email", type: "conversation", icon: "envelope-simple-duotone" },
  { name: "Update stock across systems", channel: "Sheets", type: "canvas", icon: "table-duotone", brand: "logos:google-sheets" },
  { name: "Onboard a new client", channel: "Slack", type: "canvas", icon: "handshake-duotone", brand: "logos:slack-icon" },
  { name: "Route a support ticket", channel: "Zendesk", type: "canvas", icon: "lifebuoy-duotone", brand: "logos:zendesk-icon" },
  { name: "Send an order update", channel: "WhatsApp", type: "conversation", icon: "truck-duotone", brand: "logos:whatsapp-icon" },
];

export function JobPicker() {
  const [selected, setSelected] = useState(0);
  const job = jobs[selected];
  return (
    <div className="mt-12">
      <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-4 lg:hidden" aria-label="Choose a job">
        {jobs.map((item, index) => (
          <button key={item.name} onClick={() => setSelected(index)} aria-pressed={selected === index} className={cn("min-h-11 shrink-0 snap-start cursor-pointer rounded-[11px] border px-4 text-left text-sm font-semibold transition-colors", selected === index ? "border-brand/35 bg-brand-tint text-brand-strong" : "border-hairline bg-white text-body")}>
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-5 lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:gap-6">
        <JobRail jobs={jobs.slice(0, 4)} offset={0} selected={selected} onSelect={setSelected} className="hidden lg:flex" />
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selected} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.26 }}>
              {job.type === "conversation" ? <ConversationPlayer job={job} /> : <AutomationCanvas title={job.name} compact showLog={false} className="shadow-[0_24px_56px_-28px_rgba(12,21,18,0.2)]" />}
            </motion.div>
          </AnimatePresence>
        </div>
        <JobRail jobs={jobs.slice(4)} offset={4} selected={selected} onSelect={setSelected} className="hidden lg:flex" />
      </div>

      <div className="mt-6 hidden grid-cols-2 gap-3 sm:grid lg:hidden">
        {jobs.map((item, index) => (
          <JobButton key={item.name} item={item} active={selected === index} onClick={() => setSelected(index)} />
        ))}
      </div>
    </div>
  );
}

function JobRail({ jobs: railJobs, offset, selected, onSelect, className }: { jobs: Job[]; offset: number; selected: number; onSelect: (value: number) => void; className?: string }) {
  return <div className={cn("flex-col gap-3", className)}>{railJobs.map((item, index) => <JobButton key={item.name} item={item} active={selected === index + offset} onClick={() => onSelect(index + offset)} />)}</div>;
}

function JobButton({ item, active, onClick }: { item: Job; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={cn("group flex min-h-[92px] w-full cursor-pointer items-center gap-3 rounded-[14px] border bg-white p-3 text-left transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5", active ? "border-brand/35 bg-brand-tint/40 shadow-[0_12px_24px_-20px_rgba(4,107,74,0.45)]" : "border-hairline hover:border-hairline-strong")}> 
      <FeatureIcon name={item.icon} size={24} />
      <span className="min-w-0"><strong className="block text-sm font-semibold leading-5 text-ink">{item.name}</strong><span className="mt-1 block text-xs font-medium text-muted">{item.channel}</span></span>
    </button>
  );
}

function ConversationPlayer({ job }: { job: Job }) {
  const reduceMotion = useReducedMotion();
  const [typing, setTyping] = useState(!reduceMotion);
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setTyping(false), 1200);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, job.name]);
  const question = job.name.includes("order") ? "Hi, is my order still arriving tomorrow?" : job.name.includes("invoice") ? "Can you resend the invoice for our last order?" : "Hi, can you tell me whether this is in stock?";
  const answer = job.name.includes("order") ? "Yes. It is packed and scheduled for delivery tomorrow." : job.name.includes("invoice") ? "Of course. I found it and sent a fresh copy to your email." : "Yes, it is available. I can reserve it for you now.";
  return (
    <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_24px_56px_-24px_rgba(12,21,18,0.18)]" aria-hidden="true">
      <div className="flex h-16 items-center justify-between border-b border-hairline bg-brand-tint/50 px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[11px] bg-white shadow-sm">{job.brand ? <IconifyIcon icon={job.brand} width={20} height={20} aria-hidden="true" /> : <Icon name="envelope-simple" size={20} aria-hidden />}</span>
          <div><strong className="block text-sm font-semibold text-ink">Customer support</strong><span className="text-xs text-muted">Automated by Autonomy</span></div>
        </div>
        <span className="flex items-center gap-2 text-xs font-semibold text-running-strong"><span className="size-1.5 rounded-full bg-running" /> Running</span>
      </div>
      <div className="canvas-grid flex min-h-[390px] flex-col justify-end gap-3 p-5 sm:p-7">
        <div className={cn("max-w-[82%] rounded-[14px] rounded-bl-[4px] border border-hairline bg-white p-3 text-sm leading-6 text-body shadow-sm", !reduceMotion && "animate-message-in")}>{question}</div>
        {typing && <div className="flex w-fit items-center gap-1 rounded-full border border-hairline bg-white px-3 py-2"><span className="size-1.5 rounded-full bg-muted/50" /><span className="size-1.5 rounded-full bg-muted/50" /><span className="size-1.5 rounded-full bg-muted/50" /></div>}
        <div className={cn("ml-auto max-w-[86%] rounded-[14px] rounded-br-[4px] bg-brand-tint p-3 text-sm leading-6 text-ink", !reduceMotion && "animate-message-in")} style={{ animationDelay: reduceMotion ? undefined : "1200ms" }}>{answer}</div>
        <div className={cn("ml-auto flex items-center gap-2 text-xs font-semibold text-brand-strong", !reduceMotion && "animate-message-in")} style={{ animationDelay: reduceMotion ? undefined : "1550ms" }}><Icon name="checks" size={15} aria-hidden /> Sent in 1.2 seconds</div>
      </div>
    </div>
  );
}

export { jobs };
