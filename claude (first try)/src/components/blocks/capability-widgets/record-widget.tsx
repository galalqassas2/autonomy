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

      <article className="flex flex-1 flex-col gap-4 p-5">
        <Step as="section" at={chipsAt} shown={shown}>
          <h4 className="sr-only">Lead qualification</h4>
          <dl className="grid grid-cols-2 gap-3">
            {w.chips.map((chip) => (
              <div
                key={chip.label}
                className="rounded-lg border border-hairline px-3 py-2.5"
                style={{
                  background: chip.hot
                    ? "var(--primary-a12)"
                    : "var(--white-a05)",
                }}
              >
                <dt className="t-micro text-ink-mute-2">{chip.label}</dt>
                <dd
                  className="mt-0.5 text-sm font-medium"
                  style={{ color: chip.hot ? "var(--primary)" : "var(--ink)" }}
                >
                  {chip.value}
                </dd>
              </div>
            ))}
          </dl>
        </Step>

        <dl className="flex flex-col">
          {w.fields.map((field, i) => (
            <Step
              key={field.label}
              at={fieldsAt + i}
              shown={shown}
              className="flex items-baseline justify-between gap-4 border-b border-hairline/70 py-2.5"
            >
              <dt className="t-micro shrink-0 text-ink-mute-2">{field.label}</dt>
              <dd className="truncate text-sm text-ink">{field.value}</dd>
            </Step>
          ))}
        </dl>

        <Step as="footer" at={handoffAt} shown={shown} className="mt-auto">
          <p
            className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5"
            style={{
              borderColor: "var(--primary-a35)",
              background: "var(--primary-a07)",
            }}
          >
            <ToolMark slug={w.handoff.tool} className="size-5 shrink-0" />
            <span className="text-sm text-ink">{w.handoff.text}</span>
          </p>
        </Step>
      </article>
    </>
  )
}
