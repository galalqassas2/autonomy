"use client"

import { CheckIcon } from "@phosphor-icons/react/dist/ssr"

import { DeptPanel } from "./dept-panel-shell"
import { useSequence } from "./use-sequence"

const SYSTEMS = [
  { system: "Email", task: "Account created, alias added" },
  { system: "Payroll", task: "Starter record opened" },
  { system: "Devices", task: "Laptop ordered, delivery tracked" },
  { system: "Access", task: "Permissions scoped to the role" },
  { system: "Calendar", task: "First week booked in" },
  { system: "Chat", task: "Introduced to the team" },
]

export function ChecklistPanel() {
  const step = useSequence(SYSTEMS.length, 700)

  return (
    <DeptPanel
      title="Onboarding run"
      status={step >= SYSTEMS.length ? "Ready for day one" : "Provisioning"}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <span
            className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{
              width: `${(step / SYSTEMS.length) * 100}%`,
              boxShadow: "var(--glow-soft)",
            }}
          />
        </span>
        <span className="t-micro tabular shrink-0 text-ink-mute-2">
          {step} of {SYSTEMS.length}
        </span>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {SYSTEMS.map((item, i) => {
          const done = i < step
          return (
            <li
              key={item.system}
              className="flex items-start gap-3 rounded-md border border-hairline bg-canvas-night-2 p-3"
              style={{
                opacity: done ? 1 : 0.4,
                borderColor: done ? "var(--primary-a28)" : undefined,
                transition: `opacity 300ms var(--ease-out) ${i * 50}ms, border-color 300ms var(--ease-out)`,
              }}
            >
              <span
                className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-300"
                style={{
                  background: done ? "var(--primary)" : "var(--white-a08)",
                }}
              >
                {done ? (
                  <CheckIcon size={10} weight="bold" className="text-canvas" />
                ) : null}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-ink">{item.system}</span>
                <span className="t-micro text-ink-mute-2">{item.task}</span>
              </span>
            </li>
          )
        })}
      </ul>

      <p className="t-caption mt-4 text-ink-mute">
        Six systems, one trigger. The offer being signed.
      </p>
    </DeptPanel>
  )
}
