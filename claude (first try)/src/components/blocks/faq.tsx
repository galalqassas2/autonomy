"use client"

import * as React from "react"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

const questions = [
  {
    q: "What can you automate?",
    a: "Processes that follow repeatable steps and touch software, from invoicing and onboarding to routing leads and updating records.",
  },
  {
    q: "Will it work with our tools?",
    a: "We support 1,000+ tools. If yours has no pre-built connection, we can connect it through an API or webhook.",
  },
  {
    q: "What does a project cost?",
    a: "We price each project after mapping the process. You receive a fixed scope before we build.",
  },
  {
    q: "How long until it is running?",
    a: "Most first automations go live in 2-6 weeks. We test on sample data before anything touches your live systems.",
  },
  {
    q: "What happens after launch?",
    a: "We monitor, maintain, and improve what we build under an agreed support plan.",
  },
  {
    q: "Who owns the automation?",
    a: "You do. The workflows, credentials, and documentation stay with you. If we stop working together, it keeps running.",
  },
  {
    q: "How is our data handled?",
    a: "Automations run on servers in Ireland. Nothing you send is used to train a model, and access is limited to what each workflow needs.",
  },
]

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <section id="faq" className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl mb-10 max-w-[16ch] text-ink">
          Common questions.
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
