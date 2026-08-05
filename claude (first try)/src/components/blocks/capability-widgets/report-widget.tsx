import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/dist/ssr"

import type { Widget } from "@/lib/capabilities"

import { Step } from "./step"
import { WidgetHead } from "./widget-head"
import { AMBER } from "./widget-utils"

export function ReportWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "report" }>
  shown: number
}) {
  const noteAt = w.metrics.length

  return (
    <>
      <WidgetHead tool={w.tool} title={w.title} meta="Posted to leadership, Monday at eight" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {w.metrics.map((metric, i) => {
            const Arrow = metric.up ? ArrowUpRightIcon : ArrowDownRightIcon
            const colour = metric.good ? "var(--primary)" : AMBER
            return (
              <Step key={metric.label} at={i} shown={shown}>
                <div className="flex h-full flex-col gap-1 rounded-lg border border-hairline bg-canvas-night-2 p-3">
                  <span className="t-micro text-ink-mute-2">{metric.label}</span>
                  <span className="tabular text-xl leading-none font-medium text-ink">
                    {metric.value}
                  </span>
                  <span
                    className="t-micro mt-0.5 flex items-center gap-1"
                    style={{ color: colour }}
                  >
                    <Arrow size={11} weight="bold" />
                    {metric.delta}
                  </span>
                </div>
              </Step>
            )
          })}
        </div>

        <Step at={noteAt} shown={shown} className="mt-auto">
          <p
            className="t-caption rounded-lg border px-3 py-2.5 text-ink"
            style={{ borderColor: `${AMBER}55`, background: `${AMBER}12` }}
          >
            {w.note}
          </p>
        </Step>
      </div>
    </>
  )
}
