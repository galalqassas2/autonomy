"use client"

import * as React from "react"
import { createTimeline, spring, splitText, stagger, utils } from "animejs"
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"

import { FlowCanvas } from "@/components/canvas/flow-canvas"
import { heroFlow } from "@/lib/flows"
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect"
import { useReducedMotion } from "@/lib/use-media"

export function Hero() {
  const root = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useIsoLayoutEffect(() => {
    const container = root.current
    if (!container) return

    const pick = (selector: string) =>
      Array.from(container.querySelectorAll<HTMLElement>(selector))

    const lines = pick(".hero-line")
    const sub = pick(".hero-sub")
    const ctas = pick(".hero-cta")
    const canvas = pick(".hero-canvas")
    const entering = [...sub, ...ctas, ...canvas]

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    utils.set(entering, { opacity: 0 })

    /* Characters carry the entrance, so the headline arrives as one gesture. */
    const splits = lines.map((line) =>
      splitText(line, { chars: true, words: true, accessible: true }),
    )
    const chars = splits.flatMap((split) => split.chars)

    const timeline = createTimeline({ defaults: { ease: "outExpo" } })
      .add(chars, {
        opacity: [0, 1],
        translateY: ["110%", "0%"],
        rotateX: [-78, 0],
        delay: stagger(14, { from: "first" }),
        ease: spring({ stiffness: 128, damping: 13 }),
      })
      .add(sub, { opacity: [0, 1], translateY: [18, 0], duration: 700 }, "-=640")
      .add(
        ctas,
        {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 620,
          delay: stagger(70),
          ease: "outBack",
        },
        "-=480",
      )
      .add(
        canvas,
        {
          opacity: [0, 1],
          scale: [1.03, 1],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 900,
          ease: spring({ stiffness: 96, damping: 16 }),
        },
        "-=780",
      )

    return () => {
      timeline.revert()
      splits.forEach((split) => split.revert())
      utils.set(entering, { opacity: 1 })
    }
  }, [])

  return (
    <section id="hero" ref={root} className="relative pt-[104px] pb-16 lg:pt-28 lg:pb-24">
      <div className="shell">
        <div className="grid items-center gap-12 min-[1000px]:grid-cols-[1.02fr_0.98fr] min-[1000px]:gap-[72px]">
          <div style={{ perspective: "1000px" }}>
            <h1 className="t-display-xxl text-ink">
              <span className="hero-line block overflow-hidden pb-[0.06em]">
                Your team stops doing the work.
              </span>
              <span className="hero-line block overflow-hidden pb-[0.06em] text-primary glow-text">
                The work still gets done.
              </span>
            </h1>

            <p className="hero-sub t-body-lg mt-6 max-w-[54ch] text-ink-mute">
              Your tools. Your data. Your process. We connect them so the work your
              team repeats every day happens without anyone doing it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#start" className="hero-cta btn btn-primary btn-cta">
                Start your first automation
                <ArrowRightIcon size={16} weight="bold" className="arrow" />
              </a>
              <a
                href="#watch-it-run"
                className="hero-cta btn btn-secondary btn-cta"
              >
                Watch one run
              </a>
            </div>
          </div>

          <div className="hero-canvas w-full min-[1000px]:justify-self-end">
            <FlowCanvas
              flow={heroFlow}
              mode="cascade"
              playing
              loop
              still={reduce}
              fitMode="contain"
              frameHeight={452}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
