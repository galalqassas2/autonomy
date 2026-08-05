"use client"

import * as React from "react"
import { animate } from "animejs"

import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"
import { cn } from "@/lib/utils"

import { CAPABILITIES } from "@/lib/capabilities"

import { CapabilityStage } from "./capability-stage"
import { LedgerPanel } from "./dept-ledger"
import { PipelinePanel } from "./dept-pipeline"
import { ChecklistPanel } from "./dept-checklist"
import { ReconcilePanel } from "./dept-reconcile"

type Dept = {
  id: string
  tab: string
  icon: Icon3DName
  headline: string
  tasks: string[]
  stat: { value: string; label: string }
  panel: () => React.ReactNode
}

const DEPTS: Dept[] = [
  {
    id: "finance",
    tab: "Finance",
    icon: "receipt",
    headline: "Issue, chase and reconcile every invoice. Hands off.",
    tasks: [
      "Issue invoices the moment a deal closes",
      "Chase overdue accounts on schedule",
      "Match supplier invoices to purchase orders",
      "Reconcile bank transactions overnight",
    ],
    stat: { value: "4x", label: "faster month-end close" },
    panel: () => <LedgerPanel />,
  },
  {
    id: "sales",
    tab: "Sales",
    icon: "funnel",
    headline: "Every lead captured, enriched and routed. In seconds.",
    tasks: [
      "Route new leads to the right rep instantly",
      "Enrich contacts from public data sources",
      "Log every call and email in your CRM",
      "Send quotes the minute a deal is agreed",
    ],
    stat: { value: "90%", label: "less manual data entry" },
    panel: () => <PipelinePanel />,
  },
  {
    id: "operations",
    tab: "Operations",
    icon: "crates",
    headline: "Stock, orders and suppliers. Always in agreement.",
    tasks: [
      "Reorder stock before it runs out",
      "Reconcile deliveries against purchase orders",
      "Track supplier SLAs and flag breaches",
      "Sync inventory across every system",
    ],
    stat: { value: "0", label: "missed reorders last quarter" },
    panel: () => <ReconcilePanel />,
  },
  {
    id: "support",
    tab: "Support",
    icon: "bubbles",
    headline: "Answer, triage and escalate. Across every channel.",
    tasks: [
      "Reply to FAQs on WhatsApp, email and web",
      "Triage tickets by urgency in real time",
      "Escalate to a person only when needed",
      "Log every interaction for full visibility",
    ],
    stat: { value: "24/7", label: "response coverage" },
    panel: () => (
      <div className="mx-auto w-full max-w-[380px]">
        <CapabilityStage item={CAPABILITIES[0]} />
      </div>
    ),
  },
  {
    id: "hr",
    tab: "HR",
    icon: "badge",
    headline: "Onboard across six systems from one trigger.",
    tasks: [
      "Provision accounts the day the offer is signed",
      "Collect documents before day one",
      "Assign permissions scoped to the role",
      "Schedule the first week automatically",
    ],
    stat: { value: "6", label: "systems provisioned at once" },
    panel: () => <ChecklistPanel />,
  },
]

export function DepartmentSelector() {
  const [active, setActive] = React.useState(DEPTS[0].id)
  const [direction, setDirection] = React.useState(1)

  const listRef = React.useRef<HTMLDivElement>(null)
  const pillRef = React.useRef<HTMLSpanElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const buttons = React.useRef(new Map<string, HTMLButtonElement>())

  const current = DEPTS.find((d) => d.id === active) ?? DEPTS[0]

  /* The pill measures the live button, so it survives font and width changes. */
  React.useLayoutEffect(() => {
    const move = () => {
      const button = buttons.current.get(active)
      const pill = pillRef.current
      const list = listRef.current
      if (!button || !pill || !list) return
      animate(pill, {
        width: button.offsetWidth,
        x: button.offsetLeft - list.scrollLeft,
        duration: 420,
        ease: "outElastic(1, 0.85)",
      })
    }
    const frame = requestAnimationFrame(move)
    const observer = new ResizeObserver(move)
    if (listRef.current) observer.observe(listRef.current)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [active])

  /* The panel slides in from the side the new tab sits on. */
  React.useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const entry = animate(panel, {
      opacity: [0, 1],
      x: [direction > 0 ? 40 : -40, 0],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 420,
      ease: "outExpo",
    })
    return () => {
      entry.revert()
    }
  }, [active, direction])

  const select = (id: string) => {
    if (id === active) return
    const from = DEPTS.findIndex((d) => d.id === active)
    const to = DEPTS.findIndex((d) => d.id === id)
    setDirection(to > from ? 1 : -1)
    setActive(id)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = DEPTS.findIndex((d) => d.id === active)
    if (event.key === "ArrowRight") {
      event.preventDefault()
      select(DEPTS[(index + 1) % DEPTS.length].id)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      select(DEPTS[(index - 1 + DEPTS.length) % DEPTS.length].id)
    }
  }

  return (
    <section id="departments" className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl max-w-[17ch] text-ink">
          Pick a department.
          <br />
          See what stops being manual.
        </h2>

        <div
          ref={listRef}
          role="tablist"
          aria-label="Departments"
          onKeyDown={onKeyDown}
          className="relative mt-10 flex snap-x snap-mandatory gap-1 overflow-x-auto rounded-lg border border-hairline bg-white/[0.02] p-1.5 md:overflow-visible"
        >
          <span
            ref={pillRef}
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-0 z-0 w-0 rounded-md border border-primary/40 bg-primary/[0.10]"
            style={{ boxShadow: "var(--glow-soft)" }}
          />

          {DEPTS.map((dept) => {
            const on = dept.id === active
            return (
              <button
                key={dept.id}
                ref={(el) => {
                  if (el) buttons.current.set(dept.id, el)
                  else buttons.current.delete(dept.id)
                }}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="department-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(dept.id)}
                className={cn(
                  "relative z-10 flex shrink-0 snap-start items-center gap-2.5 rounded-md px-4 py-2.5 transition-colors duration-200",
                  on ? "text-ink" : "text-ink-mute hover:text-ink",
                )}
              >
                <Icon3D name={dept.icon} size={26} />
                <span className="text-sm font-medium">{dept.tab}</span>
              </button>
            )
          })}
        </div>

        <div
          id="department-panel"
          role="tabpanel"
          className="relative mt-8 overflow-hidden"
        >
          <div ref={panelRef} key={current.id}>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              {/* Left: headline, use cases, stat */}
              <div className="flex flex-col gap-6">
                <p className="t-display-md max-w-[26ch] text-ink">
                  {current.headline}
                </p>

                <ul className="flex flex-col gap-3">
                  {current.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        style={{ boxShadow: "var(--glow-soft)" }}
                      />
                      <span className="text-sm text-ink-mute">{task}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-3 border-t border-hairline pt-5">
                  <span className="text-2xl font-semibold text-primary">
                    {current.stat.value}
                  </span>
                  <span className="t-body-md text-ink-mute">
                    {current.stat.label}
                  </span>
                </div>

                <p className="t-caption text-ink-mute-2">
                  Connected to 1,000+ tools. Runs inside the ones you already use.
                </p>
              </div>

              {/* Right: animated demo panel */}
              <div>{current.panel()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
