import type { CanvasLayout } from "./layout"

export type EdgeState = "idle" | "drawing" | "drawn"

const DRAW_MS = 520

export function CanvasConnectors({
  layout,
  stateFor,
}: {
  layout: CanvasLayout
  stateFor: (index: number) => EdgeState
}) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      width={layout.world.w}
      height={layout.world.h}
      viewBox={`0 0 ${layout.world.w} ${layout.world.h}`}
      fill="none"
    >
      {layout.edges.map((edge, i) => {
        if (!edge.d) return null
        const state = stateFor(i)
        const live = state !== "idle"

        return (
          <g key={edge.id}>
            <path
              d={edge.d}
              stroke="rgba(255,255,255,0.16)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <path
              d={edge.d}
              stroke="var(--primary)"
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{
                strokeDashoffset: live ? 0 : 1,
                opacity: state === "drawing" ? 1 : state === "drawn" ? 0.45 : 0,
                filter:
                  state === "drawing"
                    ? "drop-shadow(0 0 6px rgba(62,207,142,0.55))"
                    : "none",
                transition: `stroke-dashoffset ${DRAW_MS}ms linear, opacity 300ms linear`,
              }}
            />
            {edge.ports.map((port, p) => (
              <circle
                key={p}
                cx={port.x}
                cy={port.y}
                r={3}
                fill="var(--canvas-night-2)"
                stroke={live ? "var(--primary)" : "rgba(255,255,255,0.28)"}
                strokeWidth={1.5}
                style={{ transition: "stroke 300ms linear" }}
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}
