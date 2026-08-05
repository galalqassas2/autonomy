import { CheckIcon, DotsThreeIcon, ArrowsOutSimpleIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import type { CanvasNode as NodeData } from "@/lib/flows"

import { NODE_H, NODE_W } from "./layout"

export type NodeState = "idle" | "running" | "done"

export function CanvasNodeCard({
  node,
  state,
  x,
  y,
}: {
  node: NodeData
  state: NodeState
  x: number
  y: number
}) {
  const running = state === "running"
  const done = state === "done"

  return (
    <div
      className="absolute rounded-md border transition-shadow duration-300"
      style={{
        left: x,
        top: y,
        width: NODE_W,
        height: NODE_H,
        background: "var(--canvas-night-2)",
        borderColor: running
          ? "rgba(62,207,142,0.35)"
          : "rgba(255,255,255,0.10)",
        boxShadow: running ? "var(--glow-edge)" : "none",
      }}
    >
      {/* State bar down the left edge */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 w-[3px] rounded-l-md transition-all duration-500"
        style={{
          height: done ? "100%" : running ? "60%" : "0%",
          background: "var(--primary)",
        }}
      />

      <header className="flex h-10 items-center gap-2 border-b border-white/[0.08] pr-3 pl-4">
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full transition-colors duration-300",
            running || done ? "bg-primary" : "bg-white/25",
          )}
        />
        <span className="t-micro tracking-wide text-ink-mute-2">{node.type}</span>
        {node.chip ? (
          <span className="t-micro rounded-full bg-white/[0.06] px-2 py-0.5 text-ink-mute-2">
            {node.chip}
          </span>
        ) : null}
        <span className="ml-auto flex items-center gap-1.5 text-white/25">
          {done ? (
            <CheckIcon size={16} weight="bold" className="text-primary" />
          ) : (
            <ArrowsOutSimpleIcon size={16} />
          )}
          <DotsThreeIcon size={16} weight="bold" />
        </span>
      </header>

      <div className="flex flex-col px-4 py-3">
        {node.rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 py-[5px]"
          >
            <span className="t-micro text-ink-mute-2">{row.label}</span>
            <span
              className={cn(
                "t-micro truncate",
                row.tone === "warn" ? "text-[#e0b05a]" : "text-on-dark",
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
