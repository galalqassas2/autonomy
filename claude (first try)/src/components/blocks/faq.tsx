"use client"

import * as React from "react"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

const questions = [
  {
    q: "What can you actually automate?",
    a: "Any process that follows rules and touches software. If your team does it the same way twice, we can build it.",
  },
  {
    q: "What does a project cost?",
    a: "Most first projects land in a range we put in writing after we map the process. Ongoing support is a flat monthly fee agreed up front, with no hourly billing.",
  },
  {
    q: "How long until something is running?",
    a: "Two to six weeks for a first automation, depending on how many systems it touches. You see it working on sample data before it goes near anything live.",
  },
  {
    q: "Where does our data go?",
    a: "Onto servers in Ireland, inside the EU. Where an automation needs AI to read something, that processing stays inside the EU too.",
  },
  {
    q: "Do we have to change our current systems?",
    a: "No, and that is the point. We build around the tools your team already knows.",
  },
  {
    q: "What happens when something breaks?",
    a: "We monitor everything we build. You get an alert and a fix from us, usually before your team notices.",
  },
  {
    q: "Who owns the work?",
    a: "You do, entirely. It is built in your accounts under your credentials, and it stays yours whatever happens between us.",
  },
]

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <section id="faq" className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl mb-10 max-w-[16ch] text-ink">
          Questions we get asked.
        </h2>

        <div className="max-w-[820px]">
          {questions.map((item, i) => {
            const expanded = open === i
            return (
              <div key={item.q} className="border-b border-hairline">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="t-heading-md text-ink">{item.q}</span>
                    <PlusIcon
                      size={18}
                      className={cn(
                        "shrink-0 text-ink-mute transition-transform duration-[380ms]",
                        expanded && "rotate-45",
                      )}
                      style={{ transitionTimingFunction: "var(--ease-out)" }}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="grid transition-[grid-template-rows] duration-[380ms]"
                  style={{
                    gridTemplateRows: expanded ? "1fr" : "0fr",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="t-body-md max-w-[64ch] pb-6 text-ink-mute">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
