"use client"

import * as React from "react"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"

const questions = [
  {
    q: "What should we automate first?",
    a: "Start with work that repeats, follows clear steps, and takes time from your team. We help you choose it.",
  },
  {
    q: "Will it work with our tools?",
    a: "1,000+ tools supported. If your tool is custom, we build the connection it needs.",
  },
  {
    q: "What stays under our control?",
    a: "You set the rules and approvals. Anything outside them waits for you.",
  },
  {
    q: "How long does it take?",
    a: "Your first automation usually goes live in 2-6 weeks. We test it before it reaches your live systems.",
  },
  {
    q: "What does it cost?",
    a: "We map the process first, then give you a clear scope and price to approve.",
  },
  {
    q: "What happens after launch?",
    a: "We can monitor and maintain it. You own the workflows, credentials, and documentation. It keeps running without us.",
  },
  {
    q: "How do you protect our data?",
    a: "Your automations run in Ireland. Data sent to AI is never stored or used for training. For added confidentiality, we can connect directly to your database.",
  },
]

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0)

  return (
    <section id="faq" className="section-y bg-canvas-soft">
      <div className="shell">
        <h2 className="t-display-xl mb-10 max-w-[16ch] text-ink">
          What to expect.
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
