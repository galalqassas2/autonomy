"use client"

import * as React from "react"

import { PegtopLoader } from "@/components/fx/pegtop-loader"
import { type Capability } from "@/lib/capabilities"
import { useRunner } from "@/lib/use-widget-runner"

import {
  ChecklistWidget,
  ExtractWidget,
  InvoiceWidget,
  RecordWidget,
  ReportWidget,
  StockWidget,
  TicketWidget,
  widgetSteps,
  widgetThinksAt,
} from "./capability-widgets"
import { ChatWidget } from "./capability-widgets/chat-widget"

export function CapabilityStage({ item }: { item: Capability }) {
  const w = item.widget
  const { shown, thinking, reduce } = useRunner(
    widgetSteps(w),
    React.useCallback((i: number) => widgetThinksAt(w, i), [w]),
  )

  return (
    <section
      aria-label={`${item.label} example`}
      className="relative flex h-[440px] w-full flex-col overflow-hidden rounded-xl border border-hairline bg-canvas-night shadow-[var(--elev-3)] sm:h-[460px]"
    >
      {w.kind === "chat" ? (
        <ChatWidget w={w} shown={shown} thinking={thinking} reduce={reduce} />
      ) : w.kind === "invoice" ? (
        <InvoiceWidget w={w} shown={shown} />
      ) : w.kind === "extract" ? (
        <ExtractWidget w={w} shown={shown} />
      ) : w.kind === "record" ? (
        <RecordWidget w={w} shown={shown} />
      ) : w.kind === "ticket" ? (
        <TicketWidget w={w} shown={shown} />
      ) : w.kind === "stock" ? (
        <StockWidget w={w} shown={shown} />
      ) : w.kind === "checklist" ? (
        <ChecklistWidget w={w} shown={shown} />
      ) : (
        <ReportWidget w={w} shown={shown} />
      )}

      {/* The model only thinks inside a widget that has a thinking step. */}
      {thinking && w.kind !== "chat" ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <PegtopLoader size={40} label="Reading it" />
        </span>
      ) : null}

      {w.kind !== "chat" ? (
        <span className="t-micro absolute top-3 right-3 rounded-full bg-white/[0.06] px-2 py-0.5 text-ink-mute-2">
          Example
        </span>
      ) : null}
    </section>
  )
}
