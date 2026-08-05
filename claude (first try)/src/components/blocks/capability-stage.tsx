"use client"

import * as React from "react"

import { PegtopLoader } from "@/components/fx/pegtop-loader"
import { CHANNEL_TINT, type Capability, type ChatTurn, type Widget } from "@/lib/capabilities"
import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

import {
  ExtractWidget,
  InvoiceWidget,
  RecordWidget,
  ReportWidget,
  StockWidget,
  ToolMark,
  widgetSteps,
  widgetThinksAt,
} from "./capability-widgets"

const THINK_MS = 850
const GAP_MS = 900
const HOLD_MS = 2800
const RESTART_MS = 320

/* One cadence for every widget, so the section never feels stitched together. */
function useRunner(steps: number, thinksAt: (i: number) => boolean) {
  const reduce = useReducedMotion()
  const [shown, setShown] = React.useState(reduce ? steps : 0)
  const [thinking, setThinking] = React.useState(false)

  React.useEffect(() => {
    if (reduce) {
      setShown(steps)
      return
    }

    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })

    const play = async () => {
      while (!cancelled) {
        setShown(0)
        setThinking(false)
        await wait(RESTART_MS)
        for (let i = 0; i < steps && !cancelled; i++) {
          if (thinksAt(i)) {
            setThinking(true)
            await wait(THINK_MS)
            setThinking(false)
          }
          setShown(i + 1)
          await wait(GAP_MS)
        }
        await wait(HOLD_MS)
      }
    }

    void play()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, reduce])

  return { shown, thinking, reduce }
}

function ChatWidget({
  w,
  shown,
  thinking,
  reduce,
}: {
  w: Extract<Widget, { kind: "chat" }>
  shown: number
  thinking: boolean
  reduce: boolean
}) {
  const tint = CHANNEL_TINT[w.channel]

  const bubble = (turn: Extract<ChatTurn, { kind: "them" | "us" }>) => {
    const mine = turn.kind === "us"
    return (
      <p
        className={cn(
          "max-w-[86%] rounded-lg px-3.5 py-2.5 text-sm text-ink",
          mine
            ? "self-end rounded-br-xs"
            : "self-start rounded-bl-xs border border-hairline bg-canvas-night-2",
        )}
        style={mine ? { background: "rgba(62,207,142,0.14)" } : undefined}
      >
        {turn.text}
      </p>
    )
  }

  return (
    <>
      <header
        className="flex items-center gap-3 border-b border-hairline px-4 py-3"
        style={{ background: `rgba(${tint},0.09)` }}
      >
        {w.channel === "web" ? (
          <span
            className="grid size-8 shrink-0 place-items-center rounded-md text-xs font-medium text-primary"
            style={{ background: "rgba(62,207,142,0.14)" }}
          >
            A
          </span>
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/[0.05]">
            <ToolMark slug={w.channel} />
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-ink">{w.account}</span>
          <span className="t-micro flex items-center gap-1.5 text-ink-mute-2">
            <span
              className="size-1.5 rounded-full bg-primary"
              style={{ boxShadow: "var(--glow-soft)" }}
            />
            Online, replies in seconds
          </span>
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-end gap-2.5 overflow-hidden p-4">
        {w.turns.slice(0, shown).map((turn, i) => (
          <div
            key={i}
            className="flex flex-col"
            style={{ animation: reduce ? undefined : "caption-in 280ms var(--ease-out) both" }}
          >
            {turn.kind === "card" ? (
              <div className="self-start rounded-lg border border-hairline bg-canvas-night-2 p-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-ink">{turn.title}</span>
                    <span className="t-micro text-ink-mute-2">{turn.meta}</span>
                  </span>
                  <span
                    className="t-micro shrink-0 rounded-full px-2.5 py-1 text-primary"
                    style={{ background: "rgba(62,207,142,0.12)" }}
                  >
                    {turn.value}
                  </span>
                </div>
              </div>
            ) : turn.kind === "chips" ? (
              <div className="flex flex-wrap justify-end gap-2 self-end">
                {turn.options.map((option) => (
                  <span
                    key={option}
                    className="t-micro rounded-full border border-primary/35 px-3 py-1.5 text-primary"
                  >
                    {option}
                  </span>
                ))}
              </div>
            ) : (
              bubble(turn)
            )}
          </div>
        ))}

        {thinking ? (
          <span className="self-end pr-2">
            <PegtopLoader size={38} label="Working out the reply" />
          </span>
        ) : null}
      </div>
    </>
  )
}

export function CapabilityStage({ item }: { item: Capability }) {
  const w = item.widget
  const { shown, thinking, reduce } = useRunner(
    widgetSteps(w),
    React.useCallback((i: number) => widgetThinksAt(w, i), [w]),
  )

  return (
    <div
      aria-hidden="true"
      className="relative flex h-[520px] w-full flex-col overflow-hidden rounded-xl border border-hairline bg-canvas-night shadow-[var(--elev-3)] sm:h-[540px]"
    >
      {w.kind === "chat" ? (
        <ChatWidget w={w} shown={shown} thinking={thinking} reduce={reduce} />
      ) : w.kind === "invoice" ? (
        <InvoiceWidget w={w} shown={shown} />
      ) : w.kind === "extract" ? (
        <ExtractWidget w={w} shown={shown} />
      ) : w.kind === "record" ? (
        <RecordWidget w={w} shown={shown} />
      ) : w.kind === "stock" ? (
        <StockWidget w={w} shown={shown} />
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
          Sample
        </span>
      ) : null}
    </div>
  )
}
