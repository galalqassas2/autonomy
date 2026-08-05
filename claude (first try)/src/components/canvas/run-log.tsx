import type { RunLogLine } from "@/lib/flows"

export function RunLog({
  lines,
  printed,
}: {
  lines: RunLogLine[]
  /* How many lines have printed. Kept in sync with the canvas. */
  printed: number
}) {
  return (
    <ul aria-hidden="true" className="flex flex-col">
      {lines.map((line, i) => {
        const shown = i < printed
        return (
          <li
            key={line.event}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-white/[0.06] py-2.5 last:border-b-0"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translateY(6px)",
              transition: "opacity 200ms linear, transform 200ms linear",
            }}
          >
            <span className="t-mono text-ink-mute-2">{line.clock}</span>
            <span className="t-caption truncate text-on-dark/80">{line.event}</span>
            <span
              className="t-mono rounded-full px-2 py-0.5 text-primary"
              style={{ background: "var(--primary-a10)" }}
            >
              {line.delta}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
