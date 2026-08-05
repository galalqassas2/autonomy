import { CheckIcon } from "@phosphor-icons/react/dist/ssr"

import type { Widget } from "@/lib/capabilities"

import { ToolMark } from "./tool-mark"
import { Step } from "./step"
import { WidgetHead } from "./widget-head"

export function ExtractWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "extract" }>
  shown: number
}) {
  const fieldsAt = 1
  const filedAt = fieldsAt + w.fields.length

  return (
    <>
      <WidgetHead tool={w.source.tool} title={w.source.title} meta={w.source.meta} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Step at={0} shown={shown}>
          <p className="t-caption rounded-lg border border-hairline bg-canvas-night-2 p-3 text-ink-mute-2 italic">
            {w.raw}
          </p>
        </Step>

        <dl className="flex flex-col">
          {w.fields.map((field, i) => (
            <Step key={field.label} at={fieldsAt + i} shown={shown}>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline/70 py-2.5">
                <dt className="t-micro shrink-0 text-ink-mute-2">{field.label}</dt>
                <dd className="flex items-center gap-1.5 truncate text-sm text-ink">
                  <CheckIcon size={12} weight="bold" className="shrink-0 text-primary" />
                  {field.value}
                </dd>
              </div>
            </Step>
          ))}
        </dl>

        <Step at={filedAt} shown={shown} className="mt-auto">
          <div className="flex items-center gap-2.5 rounded-lg border border-hairline px-3 py-2.5">
            <ToolMark slug={w.filedTo.tool} className="size-5 shrink-0" />
            <span className="text-sm text-ink">{w.filedTo.text}</span>
          </div>
        </Step>
      </div>
    </>
  )
}
