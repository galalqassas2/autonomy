"use client"

import * as React from "react"
import { ArrowClockwiseIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { FlowCanvas, type FlowCanvasHandle } from "@/components/canvas/flow-canvas"
import { RunLog } from "@/components/canvas/run-log"
import type { RunSnapshot } from "@/components/canvas/use-flow-run"
import { useCountUp } from "@/components/fx/count-up"
import { HoverButton } from "@/components/fx/hover-button"
import { KineticGridMount } from "@/components/fx/kinetic-grid-mount"
import { orderToInvoice, orderToInvoiceLog } from "@/lib/flows"
import { useMediaQuery, useReducedMotion } from "@/lib/use-media"

const CAPTIONS = [
  "An order arrives from your store.",
  "Stock is checked automatically.",
  "The invoice writes itself.",
  "Your team is notified.",
]

const TOTAL_SECONDS = 1.2

export function AutomationStage() {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<FlowCanvasHandle>(null)
  const reduce = useReducedMotion()
  const wide = useMediaQuery("(min-width: 768px)")

  const [armed, setArmed] = React.useState(false)
  const [inView, setInView] = React.useState(false)
  const [snapshot, setSnapshot] = React.useState<RunSnapshot | null>(null)

  /* Arms once the section is meaningfully in view, then pauses off screen. */
  React.useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting)
          if (entry.intersectionRatio >= 0.4) setArmed(true)
        }
      },
      { threshold: [0, 0.4] },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  /* Zoom resets once the section is more than a screen height away. */
  React.useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) canvasRef.current?.fit()
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const finished = reduce || Boolean(snapshot?.finished)
  const running = Boolean(snapshot) && !finished
  const printed = reduce ? CAPTIONS.length : (snapshot?.doneCount ?? 0)
  const step = snapshot
    ? Math.max(snapshot.activeIndex, snapshot.doneCount - 1)
    : -1
  const captionIndex = finished
    ? CAPTIONS.length - 1
    : Math.min(CAPTIONS.length - 1, Math.max(0, step))

  const seconds = useCountUp(finished ? TOTAL_SECONDS : 0, true)

  const replay = () => {
    canvasRef.current?.replay()
    setSnapshot(null)
  }

  return (
    <section id="watch-it-run" ref={sectionRef} className="section-y">
      <div className="shell">
        <div className="mb-8 max-w-4xl">
          <p className="t-caption mb-3 font-medium text-primary">See it run</p>
          <h2 className="t-display-xl text-ink">
            An order comes in.{" "}
            <span className="glow-text inline-block py-1 text-primary">The rest runs itself.</span>
          </h2>
          <p className="t-body-lg mt-4 text-ink-mute">
            From order to invoice, without anyone touching it.
          </p>
        </div>

        <div className="island island-bleed relative overflow-hidden">
          <KineticGridMount />

          <div className="relative z-10 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <p
              key={captionIndex}
              className="t-heading-md mb-5 min-h-[1.75rem] text-on-dark"
              style={{ animation: "caption-in 320ms var(--ease-out) both" }}
            >
              {CAPTIONS[captionIndex]}
            </p>

            <FlowCanvas
              ref={canvasRef}
              flow={orderToInvoice}
              mode={wide ? "serpentine" : "stack"}
              playing={armed && inView}
              still={reduce}
              zoomable
              fitMode={wide ? "none" : "width"}
              frameHeight={wide ? 420 : 700}
              onSnapshot={setSnapshot}
              action={
                <HoverButton
                  onClick={replay}
                  disabled={running || reduce}
                  aria-label="Run this flow again"
                >
                  Run
                </HoverButton>
              }
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <RunLog lines={orderToInvoiceLog} printed={printed} />

              <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
                <p className="t-caption flex items-baseline gap-2 text-ink-mute-2">
                  Total
                  <span className="tabular text-lg leading-none font-medium text-on-dark">
                    {seconds.toFixed(1)}s
                  </span>
                </p>

                {finished && !reduce ? (
                  <button
                    type="button"
                    onClick={replay}
                    className="t-button flex items-center gap-2 rounded-sm px-3 py-2 text-ink-mute-2 transition-colors duration-150 hover:bg-white/[0.06] hover:text-on-dark"
                  >
                    <ArrowClockwiseIcon size={15} weight="bold" />
                    Replay
                  </button>
                ) : null}

                <HoverButton href="#start">
                  Find your first automation
                  <ArrowRightIcon size={15} weight="bold" />
                </HoverButton>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
