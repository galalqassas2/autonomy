"use client"

import * as React from "react"

import { CAPABILITIES, type Capability } from "@/lib/capabilities"
import { cn } from "@/lib/utils"

import { CapabilityStage } from "./capability-stage"
import { ToolMark } from "./capability-widgets/tool-mark"

function ToolStack({ tools }: { tools: string[] }) {
  return (
    <span className="flex shrink-0 items-center -space-x-1.5">
      {tools.map((slug) => (
        <span
          key={slug}
          className="grid size-7 place-items-center rounded-full border border-hairline bg-canvas-night"
        >
          <ToolMark slug={slug} className="size-4" />
        </span>
      ))}
    </span>
  )
}

function CapabilityCard({
  item,
  active,
  onSelect,
}: {
  item: Capability
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-all duration-200",
        active
          ? "border-primary/50 bg-primary/[0.07]"
          : "border-hairline bg-white/[0.02] hover:border-hairline-strong",
      )}
      style={active ? { boxShadow: "var(--glow-soft)" } : undefined}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-ink">{item.label}</span>
        <span className="t-micro truncate text-ink-mute-2">{item.team}</span>
      </span>
      <ToolStack tools={item.tools} />
    </button>
  )
}

export function ConversationDemo() {
  const [activeId, setActiveId] = React.useState(CAPABILITIES[0].id)
  const active = CAPABILITIES.find((c) => c.id === activeId) ?? CAPABILITIES[0]

  const cards = (items: Capability[], className?: string) => (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => (
        <CapabilityCard
          key={item.id}
          item={item}
          active={item.id === activeId}
          onSelect={() => setActiveId(item.id)}
        />
      ))}
    </div>
  )

  return (
    <section id="every-channel" className="section-y">
      <div className="shell">
        <div className="mx-auto max-w-[62ch] text-center">
          <h2 className="t-display-xl text-ink">
            Pick a job your team does every day.
            <br />
            <span className="glow-text text-primary">Watch it handled.</span>
          </h2>
          <p className="t-body-lg mt-5 text-ink-mute">
            Ten of the thousand. Each one runs across the tools you already pay
            for, start to finish, without anyone opening a tab.
          </p>
        </div>

        {/*
          One list at every size. Stage on top through tablet, flanked by the
          two card groups above 1280px.
        */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-[1fr_380px_1fr] xl:items-start xl:gap-7">
          <div className="order-1 sm:col-span-2 xl:order-2 xl:col-span-1 xl:sticky xl:top-24">
            <div className="mx-auto w-full max-w-[380px]">
              <CapabilityStage key={active.id} item={active} />
              <p className="t-caption mt-4 text-center text-ink-mute">
                {active.impact}
              </p>
            </div>
          </div>

          {cards(CAPABILITIES.slice(0, 5), "order-2 xl:order-1 xl:justify-between")}
          {cards(CAPABILITIES.slice(5), "order-3 xl:justify-between")}
        </div>
      </div>
    </section>
  )
}
