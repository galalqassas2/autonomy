"use client"

import * as React from "react"

import { useReducedMotion } from "@/lib/use-media"
import type { chapters } from "@/lib/nav"

/*
  The chapter links in the header. Scroll position owns which one is current,
  so the lit pill reads as "where you are", never as "what you clicked".
*/

const SPARKS = 10
const SPARK_MS = 840
/* Thrown out this far, drawn back to this. */
const SPARK_SPREAD = [70, 8] as const

type Rect = { left: number; top: number; width: number; height: number }

/* Seeded, not random, so a chapter always bursts the same way. */
const jitter = (seed: number, spread: number) => {
  const n = Math.sin(seed * 12.9898) * 43758.5453
  return (n - Math.floor(n) - 0.5) * spread
}

/* One spark, sent along a shared angle so the burst reads as a ring. */
function spark(chapter: number, index: number, total: number): React.CSSProperties {
  const seed = chapter * 97 + index * 13
  const angle = (((360 + jitter(seed, 8)) / total) * (total - index) * Math.PI) / 180
  const at = (distance: number) =>
    [distance * Math.cos(angle), distance * Math.sin(angle)] as const

  const [startX, startY] = at(SPARK_SPREAD[0])
  const [endX, endY] = at(SPARK_SPREAD[1] + jitter(seed + 1, 7))
  const spin = jitter(seed + 2, 10)

  return {
    "--start-x": `${startX.toFixed(1)}px`,
    "--start-y": `${startY.toFixed(1)}px`,
    "--end-x": `${endX.toFixed(1)}px`,
    "--end-y": `${endY.toFixed(1)}px`,
    "--time": `${(SPARK_MS + jitter(seed + 3, 240)).toFixed(0)}ms`,
    "--scale": (1 + jitter(seed + 4, 0.3)).toFixed(2),
    "--rotate": `${((spin > 0 ? spin + 5 : spin - 5) * 10).toFixed(0)}deg`,
  } as React.CSSProperties
}

export function ChapterNav({
  items,
  activeId,
}: {
  items: typeof chapters
  activeId: string | null
}) {
  const listRef = React.useRef<HTMLUListElement>(null)
  const [rect, setRect] = React.useState<Rect | null>(null)
  const reduce = useReducedMotion()

  const index = items.findIndex((item) => item.id === activeId)

  /* Measured from the live link, so it survives the font swap and resizes. */
  React.useLayoutEffect(() => {
    const list = listRef.current
    const link = list?.children[index] as HTMLElement | undefined
    if (!list || !link) {
      setRect(null)
      return
    }

    const measure = () =>
      setRect({
        left: link.offsetLeft,
        top: link.offsetTop,
        width: link.offsetWidth,
        height: link.offsetHeight,
      })

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [index])

  /* Rolled per chapter, not per render, so a burst never restarts midway. */
  const sparks = React.useMemo(
    () =>
      reduce ? [] : Array.from({ length: SPARKS }, (_, i) => spark(index, i, SPARKS)),
    [index, reduce],
  )

  return (
    <div className="chapter-nav">
      {rect ? (
        /* The pill itself persists so it slides. Only the sparks remount. */
        <span aria-hidden="true" className="chapter-nav__pill" style={rect}>
          {sparks.map((style, i) => (
            <span key={`${index}-${i}`} className="chapter-nav__spark" style={style} />
          ))}
        </span>
      ) : null}

      <ul ref={listRef} className="chapter-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              data-current={item.id === activeId || undefined}
              aria-current={item.id === activeId ? "true" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
