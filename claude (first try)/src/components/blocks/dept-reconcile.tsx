"use client"

import { CheckIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr"

import { DeptPanel } from "./dept-panel-shell"
import { useSequence } from "./use-sequence"

const LINES = [
  { sku: "Oak worktop, 3m", counted: "matches the order" },
  { sku: "Brass handle, brushed", counted: "short, supplier told" },
  { sku: "Soft close hinge", counted: "matches the order" },
  { sku: "Walnut panel, 18mm", counted: "over, credit raised" },
  { sku: "Adjustable foot", counted: "matches the order" },
]

export function ReconcilePanel() {
  const step = useSequence(LINES.length)

  return (
    <DeptPanel
      title="Stock reconciliation"
      status={step >= LINES.length ? "In agreement" : "Comparing"}
    >
      <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-hairline pb-2">
        <span className="t-micro text-ink-mute-2">Item</span>
        <span className="t-micro text-ink-mute-2">Against the order</span>
      </div>

      {LINES.map((line, i) => {
        const done = i < step
        const flagged = done && line.counted !== "matches the order"
        return (
          <div
            key={line.sku}
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-hairline/70 py-3 last:border-b-0"
            style={{
              opacity: done ? 1 : 0.4,
              transition: `opacity 320ms var(--ease-out) ${i * 40}ms`,
            }}
          >
            <span className="truncate text-sm text-ink">{line.sku}</span>
            <span
              className="t-micro flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors duration-300"
              style={{
                background: flagged
                  ? "rgba(224,176,90,0.12)"
                  : done
                    ? "rgba(62,207,142,0.12)"
                    : "rgba(255,255,255,0.05)",
                color: flagged
                  ? "#e0b05a"
                  : done
                    ? "var(--primary)"
                    : "var(--ink-mute-2)",
              }}
            >
              {done ? (
                flagged ? (
                  <WarningIcon size={11} weight="fill" />
                ) : (
                  <CheckIcon size={11} weight="bold" />
                )
              ) : null}
              {done ? line.counted : "Counting"}
            </span>
          </div>
        )
      })}

      <p className="t-caption mt-4 border-t border-hairline pt-4 text-ink-mute">
        Two gaps found and handled. Nobody compared two documents by eye.
      </p>
    </DeptPanel>
  )
}
