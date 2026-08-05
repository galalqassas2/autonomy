"use client"

import { Chip, DeptPanel, Row } from "./dept-panel-shell"
import { useSequence } from "./use-sequence"

/* Roles rather than names, so nothing here reads as a real account. */
const ACCOUNTS = [
  { name: "Trade account", stage: "Invoice issued" },
  { name: "Retail order", stage: "Invoice issued" },
  { name: "Service contract", stage: "Reminder sent" },
  { name: "Repeat customer", stage: "Reminder sent" },
  { name: "Overdue account", stage: "Escalated to owner" },
]

export function LedgerPanel() {
  const step = useSequence(ACCOUNTS.length)

  return (
    <DeptPanel
      title="Invoice run"
      status={step >= ACCOUNTS.length ? "Run complete" : "Running"}
    >
      <div className="flex flex-col">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-hairline pb-2">
          <span className="t-micro text-ink-mute-2">Account</span>
          <span className="t-micro text-ink-mute-2">State</span>
        </div>
        {ACCOUNTS.map((account, i) => {
          const done = i < step
          return (
            <Row key={account.name} done={done} delay={i * 40}>
              <span className="truncate text-sm text-ink">{account.name}</span>
              <Chip done={done}>{done ? account.stage : "Waiting"}</Chip>
            </Row>
          )
        })}
      </div>

      <p className="t-caption mt-4 border-t border-hairline pt-4 text-ink-mute">
        Nobody opened a spreadsheet. Nobody wrote a chaser.
      </p>
    </DeptPanel>
  )
}
