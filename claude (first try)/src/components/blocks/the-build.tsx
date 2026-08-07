"use client"

import * as React from "react"

import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect"

const STEPS: {
  icon: Icon3DName
  name: string
  body: string
  timing: string
}[] = [
  {
    icon: "map",
    name: "Map",
    body: "We sit with the people doing the work and draw the process as it really runs.",
    timing: "1 hour",
  },
  {
    icon: "target",
    name: "Scope",
    body: "We pick the smallest change with the largest return, and agree the number we are judged on.",
    timing: "1 week",
  },
  {
    icon: "blocks",
    name: "Build",
    body: "We build inside your existing tools and test on sample data before anything goes live.",
    timing: "2 to 6 weeks",
  },
  {
    icon: "gauge",
    name: "Run",
    body: "We watch it, fix what breaks, and report what it saved you.",
    timing: "Ongoing",
  },
]

export function TheBuild() {
  const listRef = React.useRef<HTMLOListElement>(null)

  /*
    Scroll position drives the rail, so the reader sets the pace and the steps
    light in order. One progress value on the list; CSS picks the axis, since
    the rail runs across on desktop and down the side on mobile.
  */
  useIsoLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const steps = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"))

    const paint = (progress: number) => {
      list.style.setProperty("--rail", progress.toFixed(3))
      steps.forEach((step, i) =>
        step.toggleAttribute("data-lit", progress >= (i + 0.5) / steps.length),
      )
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(1)
      return
    }

    let frame = 0

    /* Empty as the row arrives four fifths down, full once it clears the middle. */
    const measure = () => {
      frame = 0
      const { top, height } = list.getBoundingClientRect()
      const from = window.innerHeight * 0.8
      const to = window.innerHeight * 0.5 - height
      paint(Math.min(1, Math.max(0, (from - top) / (from - to))))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <section id="the-build" className="section-y">
      <div className="shell">
        <h2 className="t-display-xl max-w-[16ch] text-ink">
          Four steps.
          <br />
          <span className="glow-text text-primary">
            You are only needed for the first.
          </span>
        </h2>

        <ol ref={listRef} className="build-steps">
          <span aria-hidden="true" className="build-track" />
          <span aria-hidden="true" className="build-rail" />

          {STEPS.map((step, i) => (
            <li key={step.name} data-step className="build-step">
              <span className="icon-plate">
                <Icon3D name={step.icon} />
              </span>

              <div className="mt-5 flex items-baseline gap-3">
                <h3 className="t-display-md text-ink">{step.name}</h3>
                <span className="t-mono text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="t-body-md mt-2 max-w-[34ch] text-ink-mute">{step.body}</p>
              <span className="t-caption mt-3 block text-primary">{step.timing}</span>
            </li>
          ))}
        </ol>

        <p className="t-body-lg mt-12 max-w-[62ch] text-ink">
          You keep working the way you work. Nothing gets replaced.
        </p>
      </div>
    </section>
  )
}
