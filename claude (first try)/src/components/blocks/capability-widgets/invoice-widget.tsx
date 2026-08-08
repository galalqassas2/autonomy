import { SealCheckIcon } from "@phosphor-icons/react/dist/ssr"

import type { Widget } from "@/lib/capabilities"
import { cn } from "@/lib/utils"

import { ToolMark } from "./tool-mark"
import { Step } from "./step"
import { WidgetHead } from "./widget-head"

export function InvoiceWidget({
  w,
  shown,
}: {
  w: Extract<Widget, { kind: "invoice" }>
  shown: number
}) {
  const totalsAt = w.lines.length
  const stampAt = totalsAt + 1

  return (
    <>
      <WidgetHead tool="xero" title="Invoice" meta={`Billed to ${w.billedTo}`} />

      <article className="flex flex-1 flex-col p-5">
        <table className="w-full border-collapse">
          <caption className="sr-only">Invoice line items</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {w.lines.map((line, i) => (
              <Step
                as="tr"
                key={line.desc}
                at={i}
                shown={shown}
                className="border-b border-hairline/70"
              >
                <td className="py-3 pr-4">
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm text-ink">{line.desc}</span>
                    <span className="t-micro text-ink-mute-2">{line.detail}</span>
                  </span>
                </td>
                <td className="tabular py-3 text-right text-sm text-ink">{line.amount}</td>
              </Step>
            ))}
          </tbody>
        </table>

        <Step as="section" at={totalsAt} shown={shown} className="mt-4">
          <h4 className="sr-only">Invoice totals</h4>
          <dl className="flex flex-col gap-1.5">
            {w.totals.map((total) => (
              <div key={total.label} className="flex items-baseline justify-between gap-4">
                <dt
                  className={cn(
                    total.strong ? "text-sm font-medium text-ink" : "t-caption text-ink-mute",
                  )}
                >
                  {total.label}
                </dt>
                <dd
                  className={cn(
                    "tabular",
                    total.strong ? "text-lg font-medium text-ink" : "t-caption text-ink-mute",
                  )}
                >
                  {total.value}
                </dd>
              </div>
            ))}
          </dl>
        </Step>

        <Step as="footer" at={stampAt} shown={shown} className="mt-auto">
          <p
            className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5"
            style={{
              borderColor: "var(--primary-a35)",
              background: "var(--primary-a07)",
            }}
          >
            <ToolMark slug="stripe" className="size-5 shrink-0" />
            <span className="text-sm text-ink">{w.stamp}</span>
            <SealCheckIcon size={16} weight="fill" className="ml-auto text-primary" />
          </p>
        </Step>
      </article>
    </>
  )
}
