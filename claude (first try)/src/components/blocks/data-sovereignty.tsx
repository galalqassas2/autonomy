"use client"

import * as React from "react"

import { Filaments } from "@/components/fx/filaments"
import { cn } from "@/lib/utils"

/*
  The loop draws itself as the band arrives, then the three hops land on it.
  Both are CSS transitions switched by one data attribute. An earlier version
  drove them from two scroll-linked animations that never fired, which left
  the hops invisible and the line permanently drawn.
*/

const HOPS = [
  { label: "Your systems", note: "Where the record already lives" },
  { label: "Autonomy, in Ireland", note: "Runs the steps, reads what it needs" },
  { label: "Back to your systems", note: "Written, logged, done" },
]

const FACTS = [
  { k: "Hosted in Ireland", v: "Your automation server and stored data" },
  { k: "Never training data", v: "Nothing you send is used to train a model" },
  { k: "Scoped access", v: "Only the systems and permissions each workflow needs" },
  { k: "Full ownership", v: "The automation and its documentation belong to you" },
]

export function DataSovereignty() {
  const root = React.useRef<HTMLElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const section = root.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { threshold: 0.2 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="your-data"
      ref={root}
      data-shown={shown}
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: "var(--canvas-night)" }}
    >
      <Filaments className="opacity-30" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <div>
            <h2 className="t-display-xl max-w-[17ch] text-ink">
              Your data <span className="glow-text text-primary">stays yours.</span>
            </h2>
            <p className="t-body-lg mt-5 max-w-[46ch] text-ink-mute">
              Your automations run in Ireland, and nothing you send is used to
              train a model.
            </p>

            <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {FACTS.map((fact) => (
                <div key={fact.k} className="flex flex-col gap-1">
                  <dt className="text-sm font-medium text-primary">{fact.k}</dt>
                  <dd className="t-caption text-ink-mute">{fact.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 420 260" className="w-full" fill="none">
              {/* pathLength normalises the dash maths, so the CSS needs no measurement. */}
              <path
                className="sovereignty-path"
                d="M74 62 H346 A32 32 0 0 1 346 126 H74 A32 32 0 0 0 74 190 H346"
                pathLength={1}
                stroke="var(--primary)"
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.7}
              />
            </svg>

            <ol className="absolute inset-0 flex flex-col justify-between py-[46px]">
              {HOPS.map((hop, i) => (
                <li
                  key={hop.label}
                  style={{ "--hop-delay": `${400 + i * 180}ms` } as React.CSSProperties}
                  className={cn(
                    "sovereignty-hop flex w-fit items-center gap-3 rounded-lg border border-hairline bg-canvas-night-2 px-4 py-3",
                    i === 1 && "ml-auto",
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full bg-primary"
                    style={{ boxShadow: "var(--glow-soft)" }}
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-ink">{hop.label}</span>
                    <span className="t-micro text-ink-mute-2">{hop.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
