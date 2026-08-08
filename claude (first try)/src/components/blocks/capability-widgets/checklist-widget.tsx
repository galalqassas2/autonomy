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

      <article className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <progress
            aria-label="Onboarding tasks ready"
            value={done}
            max={w.rows.length}
            className="h-1 flex-1 overflow-hidden rounded-full accent-primary [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-white/[0.06] [&::-webkit-progress-value]:bg-primary"
          />
          <output className="t-micro tabular shrink-0 text-ink-mute-2">
            {done} of {w.rows.length} ready
          </output>
        </div>

        <ul className="flex flex-col">
          {w.rows.map((row, i) => (
            <Step
              as="li"
              key={row.system}
              at={rowsAt + i}
              shown={shown}
              className="flex items-start gap-3 border-b border-hairline/70 py-2.5"
            >
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
            </Step>
          ))}
        </ul>
      </article>
    </>
  )
}
