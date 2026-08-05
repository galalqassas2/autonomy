"use client"

import * as React from "react"
import { animate, onScroll, stagger, svg, utils } from "animejs"

import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect"
import { cn } from "@/lib/utils"

const HOPS = [
  { label: "Your systems", note: "Where the record already lives" },
  { label: "Our AI, in Ireland", note: "Reads it, never learns from it" },
  { label: "Back to your systems", note: "Written, logged, done" },
]

const FACTS = [
  { k: "Ireland", v: "Processed and stored inside the EU" },
  { k: "Our own model", v: "No third party ever sees the data" },
  { k: "Never trained on", v: "Your records do not become weights" },
  { k: "Scoped access", v: "Only what the automation needs, only while it needs it" },
]

export function DataSovereignty() {
  const root = React.useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const container = root.current
    if (!container) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const path = container.querySelector<SVGPathElement>(".sovereignty-path")
    const hops = Array.from(
      container.querySelectorAll<HTMLElement>(".sovereignty-hop"),
    )
    if (!path) return

    utils.set(hops, { opacity: 0 })
    const enter = { target: container, enter: "top 78%", repeat: false }

    /* The loop draws itself as the section arrives, then the hops land on it. */
    const line = animate(svg.createDrawable(path), {
      draw: ["0% 0%", "0% 100%"],
      duration: 1600,
      ease: "inOutQuad",
      autoplay: onScroll(enter),
    })

    const marks = animate(hops, {
      opacity: [0, 1],
      translateY: [18, 0],
      scale: [0.94, 1],
      duration: 700,
      delay: stagger(180, { start: 400 }),
      ease: "outBack",
      autoplay: onScroll(enter),
    })

    return () => {
      line.revert()
      marks.revert()
      utils.set(hops, { opacity: 1 })
    }
  }, [])

  return (
    <section
      id="your-data"
      ref={root}
      className="py-20 lg:py-28"
      style={{ background: "var(--canvas-night)" }}
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <div>
            <h2 className="t-display-xl max-w-[16ch] text-ink">
              Your data goes to Ireland.
              <br />
              <span className="glow-text text-primary">Then it comes back.</span>
            </h2>
            <p className="t-body-lg mt-5 max-w-[46ch] text-ink-mute">
              That is the whole journey. It is not copied to a model vendor, it is
              not used for training, and it does not leave the EU on the way.
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
            <svg
              aria-hidden="true"
              viewBox="0 0 420 260"
              className="w-full"
              fill="none"
            >
              <path
                className="sovereignty-path"
                d="M74 62 H346 A32 32 0 0 1 346 126 H74 A32 32 0 0 0 74 190 H346"
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
                  className={cn(
                    "sovereignty-hop flex w-fit items-center gap-3 rounded-lg border border-hairline bg-canvas-night-2 px-4 py-3",
                    i === 1 && "ml-auto",
                  )}
                  style={i === 1 ? { boxShadow: "var(--glow-edge)" } : undefined}
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
