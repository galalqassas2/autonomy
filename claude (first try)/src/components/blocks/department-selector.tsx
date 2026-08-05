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
  outcome: string
  panel: () => React.ReactNode
}

const DEPTS: Dept[] = [
  {
    id: "finance",
    tab: "Finance",
    icon: "receipt",
    outcome: "issues and chases every invoice without opening a spreadsheet",
    panel: () => <LedgerPanel />,
  },
  {
    id: "sales",
    tab: "Sales",
    icon: "funnel",
    outcome: "routes and enriches every lead the minute it lands",
    panel: () => <PipelinePanel />,
  },
  {
    id: "operations",
    tab: "Operations",
    icon: "crates",
    outcome: "keeps stock, orders and suppliers in agreement",
    panel: () => <ReconcilePanel />,
  },
  {
    id: "support",
    tab: "Support",
    icon: "bubbles",
    outcome: "answers the same forty questions without a person",
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
    outcome: "onboards a new starter across six systems in one go",
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

        <p className="t-display-md mt-10 max-w-[30ch] text-ink">
          <span className="text-primary">{current.tab}</span> {current.outcome}.
        </p>

        <div
          id="department-panel"
          role="tabpanel"
          className="relative mt-8 min-h-[420px] overflow-hidden"
        >
          <div ref={panelRef} key={current.id}>
            {current.panel()}
          </div>
        </div>
      </div>
    </section>
  )
}
