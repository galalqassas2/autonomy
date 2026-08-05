import * as React from "react"

import { PegtopLoader } from "@/components/fx/pegtop-loader"
import { CHANNEL_TINT, type ChatTurn, type Widget } from "@/lib/capabilities"
import { cn } from "@/lib/utils"

import { ToolMark } from "../capability-widgets"

export function ChatWidget({
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
        style={mine ? { background: "var(--primary-a14)" } : undefined}
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
            style={{ background: "var(--primary-a14)" }}
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
                    style={{ background: "var(--primary-a12)" }}
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
