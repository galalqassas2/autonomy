"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
  A card that answers the pointer. Every card gets a soft spotlight; a lit one
  also carries an edge of light and a few drifting motes, so the option we
  recommend is the only one on the row that looks alive.

  Mote placement is derived from the index rather than random, so the server
  and client render the same markup.
*/

const MOTES = Array.from({ length: 8 }, (_, i) => ({
  left: `${((i * 37 + 11) % 88) + 6}%`,
  top: `${((i * 53 + 23) % 62) + 30}%`,
  delay: `${(i * 0.9).toFixed(1)}s`,
  time: `${6 + (i % 4)}s`,
}))

/* Percentages, so the gradients follow the pointer without a re-render. */
function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`)
  card.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height) * 100}%`)
}

export function GlowCard({
  lit,
  className,
  children,
}: {
  lit?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-lit={lit || undefined}
      onPointerMove={trackPointer}
      className={cn("glow-card", className)}
    >
      {lit ? (
        <span aria-hidden="true" className="glow-card__motes">
          {MOTES.map((mote, i) => (
            <i
              key={i}
              style={
                {
                  left: mote.left,
                  top: mote.top,
                  "--delay": mote.delay,
                  "--time": mote.time,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      ) : null}
      {children}
    </div>
  )
}
