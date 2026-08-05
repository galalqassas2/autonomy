import type { Widget } from "@/lib/capabilities"

import { ToolMark } from "./tool-mark"
import { Step } from "./step"
import { WidgetHead } from "./widget-head"

export function RecordWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "record" }>
  shown: number
}) {
  const chipsAt = 1
  const fieldsAt = chipsAt + 1
  const handoffAt = fieldsAt + w.fields.length

  return (
    <>
      <WidgetHead tool={w.header.tool} title={w.header.title} meta={w.header.meta} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Step at={chipsAt} shown={shown}>
          <div className="flex flex-wrap gap-2">
            {w.chips.map((chip) => (
              <span
                key={chip.label}
                className="t-micro flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
                style={{
                  background: chip.hot
                    ? "var(--primary-a12)"
                    : "var(--white-a05)",
                  color: chip.hot ? "var(--primary)" : "var(--ink-mute)",
                }}
              >
                {chip.label}
                <span className="font-medium">{chip.value}</span>
              </span>
            ))}
          </div>
        </Step>

        <dl className="flex flex-col">
          {w.fields.map((field, i) => (
            <Step key={field.label} at={fieldsAt + i} shown={shown}>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline/70 py-2.5">
                <dt className="t-micro shrink-0 text-ink-mute-2">{field.label}</dt>
                <dd className="truncate text-sm text-ink">{field.value}</dd>
              </div>
            </Step>
          ))}
        </dl>

        <Step at={handoffAt} shown={shown} className="mt-auto">
          <div
            className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5"
            style={{
              borderColor: "var(--primary-a35)",
              background: "var(--primary-a07)",
            }}
          >
            <ToolMark slug={w.handoff.tool} className="size-5 shrink-0" />
            <span className="text-sm text-ink">{w.handoff.text}</span>
          </div>
        </Step>
      </div>
    </>
  )
}
