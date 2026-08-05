"use client"

import { CheckIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

import { DeptPanel } from "./dept-panel-shell"
import { useSequence } from "./use-sequence"

const STAGES = ["Captured", "Enriched", "Routed", "In the CRM"]

const ENRICHED = [
  { label: "Company", value: "Matched and verified" },
  { label: "Role", value: "Operations lead" },
  { label: "Territory", value: "Leinster" },
  { label: "Owner", value: "Assigned" },
]

export function PipelinePanel() {
  const step = useSequence(STAGES.length)

  return (
    <DeptPanel
      title="Lead to CRM"
      status={step >= STAGES.length ? "Owner notified" : "Enriching"}
    >
      <div className="flex items-center gap-2">
        {STAGES.map((stage, i) => {
          const done = i < step
          const active = i === step
          return (
            <div key={stage} className="flex flex-1 flex-col gap-2">
              <span
                className="h-1 rounded-full transition-colors duration-500"
                style={{
                  background: done
                    ? "var(--primary)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: active ? "var(--glow-soft)" : "none",
                }}
              />
              <span
                className={cn(
                  "t-micro truncate transition-colors duration-300",
                  done ? "text-ink" : "text-ink-mute-2",
                )}
              >
                {stage}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-md border border-hairline bg-canvas-night-2 p-4">
        <p className="t-caption text-ink-mute">
          &ldquo;Do you fit out office kitchens? We have a site in Dublin 8.&rdquo;
        </p>

        <dl className="mt-4 grid gap-y-2.5 sm:grid-cols-2 sm:gap-x-6">
          {ENRICHED.map((field, i) => {
            const done = i < step
            return (
              <div
                key={field.label}
                className="flex items-baseline justify-between gap-3 border-b border-hairline/70 pb-2"
                style={{
                  opacity: done ? 1 : 0.35,
                  transition: `opacity 320ms var(--ease-out) ${i * 60}ms`,
                }}
              >
                <dt className="t-micro text-ink-mute-2">{field.label}</dt>
                <dd className="flex items-center gap-1.5 text-sm text-ink">
                  {done ? (
                    <CheckIcon size={12} weight="bold" className="text-primary" />
                  ) : null}
                  {done ? field.value : "Looking"}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>

      <p className="t-caption mt-4 text-ink-mute">
        The lead was enriched and assigned before anyone read it.
      </p>
    </DeptPanel>
  )
}
