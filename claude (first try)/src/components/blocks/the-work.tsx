"use client"

import * as React from "react"

import { Reveal } from "@/components/fx/reveal"
import { Icon3D } from "@/components/site/icon-3d"
import type { Icon3DName } from "@/components/site/icon-3d-shapes"
import { RobotPlaceholder } from "@/components/ui/robot-placeholder"
import { SplineScene } from "@/components/ui/splite"
import { useReducedMotion } from "@/lib/use-media"

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

const costs: { icon: Icon3DName; title: string; body: string }[] = [
  {
    icon: "clock",
    title: "Time",
    body: "The same information is typed into three systems, every day.",
  },
  {
    icon: "coins",
    title: "Cost",
    body: "Skilled people spend their week on work a system should do for free.",
  },
  {
    icon: "quality",
    title: "Quality",
    body: "Every manual handoff can go wrong, and weeks pass before anyone notices.",
  },
  {
    icon: "inbox",
    title: "Communication",
    body: "Where things stand lives in an inbox instead of in the system.",
  },
]

export function TheWork() {
  const reduce = useReducedMotion()
  const [ready, setReady] = React.useState(false)

  return (
    <section id="the-work" className="section-y">
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <h2 className="t-display-xl max-w-[17ch] text-ink">
              Manual work is never free.
              <br />
              It is billed somewhere else.
            </h2>
            <p className="t-body-lg mt-5 max-w-[58ch] text-ink-mute">
              Four costs your team pays every week, none of which appear on an
              invoice.
            </p>
          </div>

          {/*
            Always mounted, no useNearViewport gate: this sits in the first
            screen a visitor is likely to scroll to, and the point was for it
            to be there immediately and moving, not to pop in once scrolled
            near.

            The scene itself is a multi-megabyte asset from Spline's own
            CDN, so "immediately" cannot mean the interactive canvas is
            there on paint one, no code change makes a network transfer
            instant. What it can mean: the robot placeholder is visible from
            the first frame, never a blank panel, and crossfades into the
            live scene the moment SplineScene's onLoad actually fires.
            prefers-reduced-motion skips the WebGL scene entirely and just
            holds the placeholder, the one case that overrides "always on".
          */}
          <div
            className="relative h-[260px] overflow-hidden rounded-xl border border-hairline bg-canvas-night shadow-[var(--elev-2)] md:h-[300px] lg:h-[340px]"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{ opacity: ready ? 0 : 1 }}
            >
              <RobotPlaceholder />
            </div>

            {!reduce ? (
              <div
                className="absolute inset-0 transition-opacity duration-500 ease-out"
                style={{ opacity: ready ? 1 : 0 }}
              >
                <SplineScene
                  scene={SCENE_URL}
                  className="h-full w-full"
                  onLoad={() => setReady(true)}
                />
              </div>
            ) : null}
          </div>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {costs.map((cost, i) => (
            <Reveal as="li" key={cost.title} index={i} className="card-light p-8">
              <span className="icon-plate">
                <Icon3D name={cost.icon} />
              </span>
              <h3 className="t-heading-lg mt-6 text-ink">{cost.title}</h3>
              <p className="t-body-md mt-2 text-ink-mute">{cost.body}</p>
            </Reveal>
          ))}
        </ul>

        <p className="t-body-lg mt-10 max-w-[62ch] text-ink">
          These never get fixed because they never get measured. That is where we
          start.
        </p>
      </div>
    </section>
  )
}
