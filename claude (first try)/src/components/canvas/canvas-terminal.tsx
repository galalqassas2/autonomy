import { FlagIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr"

import { TERM } from "./layout"

export function CanvasTerminal({
  kind,
  x,
  y,
  active,
}: {
  kind: "Start" | "End"
  x: number
  y: number
  active: boolean
}) {
  const Glyph = kind === "Start" ? PlayIcon : FlagIcon

  return (
    <div
      className="absolute flex flex-col items-center justify-center gap-1 rounded-lg border transition-colors duration-300"
      style={{
        left: x,
        top: y,
        width: TERM,
        height: TERM,
        background: "var(--canvas-night-2)",
        borderColor: active ? "rgba(62,207,142,0.35)" : "rgba(255,255,255,0.10)",
      }}
    >
      <Glyph
        size={20}
        weight="fill"
        className={active ? "text-primary" : "text-white/30"}
      />
      <span className="t-micro mt-1 text-ink-mute-2">Flow</span>
      <span className="text-sm leading-none font-medium text-on-dark">{kind}</span>
    </div>
  )
}
