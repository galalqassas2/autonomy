import * as React from "react"
import { useReducedMotion } from "@/lib/use-media"

const THINK_MS = 850
const GAP_MS = 900
const HOLD_MS = 2800
const RESTART_MS = 320

/* One cadence for every widget, so the section never feels stitched together. */
export function useRunner(steps: number, thinksAt: (i: number) => boolean) {
  const reduce = useReducedMotion()
  const [shown, setShown] = React.useState(reduce ? steps : 0)
  const [thinking, setThinking] = React.useState(false)

  React.useEffect(() => {
    if (reduce) {
      setShown(steps)
      return
    }

    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })

    const play = async () => {
      while (!cancelled) {
        setShown(0)
        setThinking(false)
        await wait(RESTART_MS)
        for (let i = 0; i < steps && !cancelled; i++) {
          if (thinksAt(i)) {
            setThinking(true)
            await wait(THINK_MS)
            setThinking(false)
          }
          setShown(i + 1)
          await wait(GAP_MS)
        }
        await wait(HOLD_MS)
      }
    }

    void play()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, reduce])

  return { shown, thinking, reduce }
}
