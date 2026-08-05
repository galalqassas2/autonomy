import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  SealCheckIcon,
} from "@phosphor-icons/react/dist/ssr"

import type { Widget } from "@/lib/capabilities"
import { cn } from "@/lib/utils"

const AMBER = "#e0b05a"

export function ToolMark({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg className={cn("size-5", className)} aria-hidden="true" focusable="false">
      <use href={`#tool-${slug}`} />
    </svg>
  )
}

/* Every widget reveals its parts off the same counter. */
function Step({
  at,
  shown,
  className,
  children,
}: {
  at: number
  shown: number
  className?: string
  children: React.ReactNode
}) {
  const on = at < shown
  return (
    <div
      className={cn("transition-[opacity,transform] duration-300", className)}
      style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(6px)" }}
    >
      {children}
    </div>
  )
}

export function WidgetHead({
  tool,
  title,
  meta,
}: {
  tool: string
  title: string
  meta: string
}) {
  return (
    <header className="flex items-center gap-3 border-b border-hairline px-4 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/[0.05]">
        <ToolMark slug={tool} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-ink">{title}</span>
        <span className="t-micro truncate text-ink-mute-2">{meta}</span>
      </span>
    </header>
  )
}

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

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col">
          {w.lines.map((line, i) => (
            <Step key={line.desc} at={i} shown={shown}>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline/70 py-2.5">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm text-ink">{line.desc}</span>
                  <span className="t-micro text-ink-mute-2">{line.detail}</span>
                </span>
                <span className="tabular shrink-0 text-sm text-ink">{line.amount}</span>
              </div>
            </Step>
          ))}
        </div>

        <Step at={totalsAt} shown={shown} className="mt-3">
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

        <Step at={stampAt} shown={shown} className="mt-auto">
          <div
            className="flex items-center gap-2.5 rounded-lg border px-3 py-2.5"
            style={{
              borderColor: "rgba(62,207,142,0.35)",
              background: "rgba(62,207,142,0.07)",
            }}
          >
            <ToolMark slug="stripe" className="size-5 shrink-0" />
            <span className="text-sm text-ink">{w.stamp}</span>
            <SealCheckIcon size={16} weight="fill" className="ml-auto text-primary" />
          </div>
        </Step>
      </div>
    </>
  )
}

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
                    ? "rgba(62,207,142,0.12)"
                    : "rgba(255,255,255,0.05)",
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
              borderColor: "rgba(62,207,142,0.35)",
              background: "rgba(62,207,142,0.07)",
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
              borderColor: "rgba(62,207,142,0.35)",
              background: "rgba(62,207,142,0.07)",
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

/* How many reveals each widget has, and where the model does the thinking. */
export function widgetSteps(w: Widget) {
  switch (w.kind) {
    case "chat":
      return w.turns.length
    case "invoice":
      return w.lines.length + 2
    case "extract":
      return 1 + w.fields.length + 1
    case "record":
      return 2 + w.fields.length + 1
    case "stock":
      return w.rows.length + 1
    case "report":
      return w.metrics.length + 1
  }
}

export function widgetThinksAt(w: Widget, i: number) {
  if (w.kind === "chat") return w.turns[i].kind !== "them"
  if (w.kind === "extract" || w.kind === "record") return i === 1
  return false
}
