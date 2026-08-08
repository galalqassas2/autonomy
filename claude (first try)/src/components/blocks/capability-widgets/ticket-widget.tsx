import type { Widget } from "@/lib/capabilities"

import { Step } from "./step"
import { ToolMark } from "./tool-mark"
import { WidgetHead } from "./widget-head"

export function TicketWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "ticket" }>
  shown: number
}) {
  const fieldsAt = 1
  const draftAt = fieldsAt + w.fields.length
  const handoffAt = draftAt + 1

  return (
    <>
      <WidgetHead tool={w.header.tool} title={w.header.title} meta={w.header.meta} />

      <article className="flex flex-1 flex-col gap-3 p-5">
        <Step
          as="blockquote"
          at={0}
          shown={shown}
          className="rounded-lg border border-hairline bg-white/[0.03] px-3 py-2.5 text-sm leading-relaxed text-ink-secondary"
        >
          {w.message}
        </Step>

        <dl className="grid grid-cols-3 gap-2">
          {w.fields.map((field, index) => (
            <Step
              as="div"
              key={field.label}
              at={fieldsAt + index}
              shown={shown}
              className="min-w-0 rounded-md bg-white/[0.04] px-2.5 py-2"
            >
              <dt className="t-micro truncate text-ink-mute-2">{field.label}</dt>
              <dd className="mt-0.5 truncate text-sm font-medium text-ink">{field.value}</dd>
            </Step>
          ))}
        </dl>

        <Step at={draftAt} shown={shown}>
          <form aria-label="Draft support reply" className="flex flex-col gap-1.5">
            <label htmlFor="support-reply" className="t-micro text-ink-mute-2">
              Reply ready for approval
            </label>
            <textarea
              id="support-reply"
              readOnly
              value={w.draft}
              className="h-[82px] resize-none rounded-lg border border-hairline bg-white/[0.03] px-3 py-2 text-sm leading-relaxed text-ink-secondary outline-none"
            />
          </form>
        </Step>

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
