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

  return (
    <>
      <WidgetHead tool="shopify" title="Stock check" meta="Compared with each reorder point" />

      <article className="flex flex-1 flex-col gap-4 p-5">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Current stock compared with reorder points</caption>
          <thead>
            <tr className="border-b border-hairline">
              <th scope="col" className="t-micro pb-2 font-normal text-ink-mute-2">
                Item
              </th>
              <th scope="col" className="t-micro pb-2 text-right font-normal text-ink-mute-2">
                Stock / minimum
              </th>
              <th scope="col" className="t-micro pb-2 text-right font-normal text-ink-mute-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {w.rows.map((row, i) => {
              const low = row.on < row.reorder
              return (
                <Step
                  as="tr"
                  key={row.sku}
                  at={i}
                  shown={shown}
                  className="border-b border-hairline/70"
                >
                  <th scope="row" className="py-3 pr-3 text-sm font-normal text-ink">
                    {row.sku}
                  </th>
                  <td className="tabular py-3 text-right text-sm text-ink-mute">
                    <data value={row.on}>{row.on}</data>
                    <span className="text-ink-faint"> / {row.reorder}</span>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span
                      className="t-micro inline-flex rounded-full px-2 py-1"
                      style={{
                        color: low ? AMBER : "var(--primary)",
                        background: low ? "var(--amber-a12)" : "var(--primary-a12)",
                      }}
                    >
                      {low ? "Reorder" : "Enough"}
                    </span>
                  </td>
                </Step>
              )
            })}
          </tbody>
        </table>

        <Step as="footer" at={orderAt} shown={shown} className="mt-auto">
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
      </article>
    </>
  )
}
