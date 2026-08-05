"use client"

import * as React from "react"

import { useReducedMotion } from "@/lib/use-media"

const DURATION = 600
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/* Counts to `value` over 600ms whenever it changes. */
export function useCountUp(value: number, active = true) {
  const reduce = useReducedMotion()
  const [shown, setShown] = React.useState(active ? value : 0)
  const fromRef = React.useRef(active ? value : 0)

  React.useEffect(() => {
    if (!active) return
    if (reduce) {
      fromRef.current = value
      setShown(value)
      return
    }

    const from = fromRef.current
    const delta = value - from
    if (delta === 0) return

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const next = from + delta * easeOut(t)
      setShown(next)
      fromRef.current = next
      if (t < 1) frame = requestAnimationFrame(tick)
      else fromRef.current = value
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, active, reduce])

  return shown
}
