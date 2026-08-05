import type { Widget } from "@/lib/capabilities"

import { ToolMark } from "./tool-mark"
import { Step } from "./step"
import { WidgetHead } from "./widget-head"
import { AMBER } from "./widget-utils"

export function StockWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "stock" }>
  shown: number
}) {
  const orderAt = w.rows.length
  const ceiling = Math.max(...w.rows.map((r) => Math.max(r.on, r.reorder))) * 1.25

  return (
    <>
      <WidgetHead tool="shopify" title="Stock on hand" meta="Against each reorder point" />

      <div className="flex flex-1 flex-col gap-4 p-4">
        {w.rows.map((row, i) => {
          const low = row.on < row.reorder
          const on = i < shown
          return (
            <Step key={row.sku} at={i} shown={shown}>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm text-ink">{row.sku}</span>
                  <span
                    className="tabular shrink-0 text-sm"
                    style={{ color: low ? AMBER : "var(--ink-mute)" }}
                  >
                    {row.on}
                  </span>
                </div>

                <div className="relative h-1.5 rounded-full bg-white/[0.06]">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: on ? `${(row.on / ceiling) * 100}%` : "0%",
                      background: low ? AMBER : "var(--primary)",
                    }}
                  />
                  {/* The reorder point, so the bar means something. */}
                  <span
                    className="absolute top-[-3px] bottom-[-3px] w-px bg-white/35"
                    style={{ left: `${(row.reorder / ceiling) * 100}%` }}
                  />
                </div>
              </div>
            </Step>
          )
        })}

        <Step at={orderAt} shown={shown} className="mt-auto">
          <div
            className="flex items-start gap-2.5 rounded-lg border px-3 py-2.5"
            style={{
              borderColor: "var(--primary-a35)",
              background: "var(--primary-a07)",
            }}
          >
            <ToolMark slug={w.order.tool} className="mt-0.5 size-5 shrink-0" />
            <span className="flex flex-col">
              <span className="text-sm text-ink">{w.order.title}</span>
              <span className="t-micro text-ink-mute-2">{w.order.detail}</span>
            </span>
          </div>
        </Step>
      </div>
    </>
  )
}
