"use client"

import * as React from "react"

import { useReducedMotion } from "@/lib/use-media"

/*
  Advances 0 to `steps`, holds at the end, then restarts. Every department
  panel runs on this so they all share one cadence.
*/
export function useSequence(steps: number, stepMs = 900, holdMs = 2200) {
  const reduce = useReducedMotion()
  const [step, setStep] = React.useState(reduce ? steps : 0)

  React.useEffect(() => {
    if (reduce) {
      setStep(steps)
      return
    }

    let timer = 0
    let current = 0
    setStep(0)

    const tick = () => {
      current = current >= steps ? 0 : current + 1
      setStep(current)
      timer = window.setTimeout(tick, current >= steps ? holdMs : stepMs)
    }

    timer = window.setTimeout(tick, stepMs)
    return () => clearTimeout(timer)
  }, [steps, stepMs, holdMs, reduce])

  return step
}
