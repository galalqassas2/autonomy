import { CheckIcon } from "@phosphor-icons/react/dist/ssr"

import type { Widget } from "@/lib/capabilities"

import { Step } from "./step"
import { WidgetHead } from "./widget-head"

export function ChecklistWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "checklist" }>
  shown: number
}) {
  const rowsAt = 1
  const done = Math.max(0, Math.min(w.rows.length, shown - rowsAt))

  return (
    <>
      <WidgetHead tool={w.header.tool} title={w.header.title} meta={w.header.meta} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{
                width: `${(done / w.rows.length) * 100}%`,
                boxShadow: "var(--glow-soft)",
              }}
            />
          </span>
          <span className="t-micro tabular shrink-0 text-ink-mute-2">
            {done} of {w.rows.length}
          </span>
        </div>

        <ul className="flex flex-col">
          {w.rows.map((row, i) => (
            <Step key={row.system} at={rowsAt + i} shown={shown}>
              <li className="flex items-start gap-3 border-b border-hairline/70 py-2.5">
                <span
                  className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full"
                  style={{ background: "var(--primary)" }}
                >
                  <CheckIcon size={10} weight="bold" className="text-canvas" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium text-ink">{row.system}</span>
                  <span className="t-micro text-ink-mute-2">{row.task}</span>
                </span>
              </li>
            </Step>
          ))}
        </ul>
      </div>
    </>
  )
}
