"use client"

import * as React from "react"
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr"

import { LightRays } from "@/components/fx/light-rays"
import { WordCycle } from "@/components/fx/word-cycle"

type Field = {
  name: string
  label: string
  placeholder: string
  examples?: readonly [string, string, string, string]
}

const fields: Field[] = [
  {
    name: "process",
    label: "What repeats",
    placeholder: "A task your team does every week",
    /* The spinner shows what a good answer looks like, so nobody stalls here. */
    examples: ["invoicing", "onboarding", "stock counts", "order updates"] as const,
  },
  {
    name: "tools",
    label: "Which tools",
    placeholder: "The systems it touches today",
  },
  {
    name: "contact",
    label: "How to reach you",
    placeholder: "Email or phone",
  },
]

export function ClosingCta() {
  const [sent, setSent] = React.useState(false)

  return (
    <section id="start" className="section-y relative overflow-hidden">
      <LightRays />

      <div className="shell relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 className="t-display-xl max-w-[17ch] text-ink">
              Find the first task <span className="glow-text text-primary">worth automating.</span>
            </h2>
            <p className="t-body-lg mt-5 max-w-[52ch] text-ink-mute">
              Tell us what your team repeats. We will show you where to start.
            </p>
          </div>

          {sent ? (
            <div className="card-light flex flex-col items-start gap-3 p-8">
              <CheckCircleIcon size={24} weight="fill" className="text-primary" />
              <p className="t-heading-lg text-ink">Thank you. We have it.</p>
              <p className="t-body-md text-ink-mute">
                We will review the process and get back to you.
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-ink"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    required
                    placeholder={field.placeholder}
                    className="field"
                  />
                  {field.examples ? (
                    <p className="t-caption text-ink-mute-2">
                      Something like <WordCycle words={field.examples} />
                    </p>
                  ) : null}
                </div>
              ))}

              <button type="submit" className="btn btn-primary btn-cta mt-1 self-start">
                Find your first automation
                <ArrowRightIcon size={16} weight="bold" className="arrow" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
