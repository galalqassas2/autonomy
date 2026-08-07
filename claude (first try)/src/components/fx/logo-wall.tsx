"use client"

import * as React from "react"

import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

/*
  A wall of tiles drifting on a tilted plane, columns running against each
  other at slightly different speeds. Decorative: the wall is hidden from
  assistive tech and the caller supplies the readable list.

  Tiles take a node rather than an image URL. Our marks are one inline SVG
  sprite, so nothing here costs a request or reaches the client bundle.
*/

export type WallTile = {
  id: string
  label: string
  node: React.ReactNode
}

type Props = {
  tiles: WallTile[]
  columns?: number
  tileSize?: number
  gap?: number
  /** Plane pitch and yaw, in degrees. */
  tilt?: number
  turn?: number
  perspective?: number
  /** How far the plane sits back, in pixels. */
  depth?: number
  /** Drift, in pixels per second. */
  speed?: number
  /** How far column speeds diverge, 0 to 1. */
  variance?: number
  /** Pointer-follow strength. 0 disables it. */
  parallax?: number
  /** Z lift on the tile under the pointer. */
  lift?: number
  /** Edge dissolve, 0 to 1. */
  fade?: number
  /** Resting tile opacity. */
  dim?: number
  className?: string
}

/* A golden-ratio walk, so no two neighbouring columns share a speed. */
const columnFactor = (index: number, variance: number) =>
  1 + variance * (((index * 0.618034 + 0.35) % 1) * 2 - 1)

export function LogoWall({
  tiles,
  columns = 7,
  tileSize = 132,
  gap = 14,
  tilt = 12,
  turn = -10,
  perspective = 1400,
  depth = 90,
  speed = 36,
  variance = 0.35,
  parallax = 0.5,
  lift = 48,
  fade = 0.62,
  dim = 0.72,
  className,
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const planeRef = React.useRef<HTMLDivElement>(null)
  const trackRefs = React.useRef<(HTMLDivElement | null)[]>([])

  const offsets = React.useRef<number[]>([])
  const speeds = React.useRef<number[]>([])
  const heldColumn = React.useRef(-1)
  const pointer = React.useRef({ x: 0, y: 0 })
  const damped = React.useRef({ x: 0, y: 0 })
  const lastFrame = React.useRef<number | null>(null)
  const litRef = React.useRef<string | null>(null)

  const [height, setHeight] = React.useState(520)
  const [lit, setLit] = React.useState<string | null>(null)
  const reduce = useReducedMotion()

  const grid = React.useMemo(() => {
    const cols: WallTile[][] = Array.from({ length: columns }, () => [])
    tiles.forEach((tile, i) => cols[i % columns].push(tile))
    return cols.filter((col) => col.length > 0)
  }, [tiles, columns])

  /* Enough copies to cover the frame at any offset, so the loop never gaps. */
  const columnSpan = React.useMemo(() => {
    const unit = tileSize + gap
    return grid.map((col) => {
      const span = Math.max(unit, col.length * unit)
      return { span, copies: Math.max(2, Math.ceil((height * 1.6) / span) + 1) }
    })
  }, [grid, tileSize, gap, height])

  const targetSpeeds = React.useMemo(
    () =>
      grid.map((_, c) => speed * columnFactor(c, variance) * (c % 2 === 0 ? 1 : -1)),
    [grid, speed, variance],
  )

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.contentRect.height || 520),
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    offsets.current = columnSpan.map(({ span }, c) => span * ((c * 0.37) % 1))
    speeds.current = grid.map(() => 0)
  }, [columnSpan, grid])

  React.useEffect(() => {
    let frame = 0

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (lastFrame.current ?? now)) / 1000)
      lastFrame.current = now

      const plane = planeRef.current
      if (plane) {
        const reach = parallax * 7
        const damp = 1 - Math.exp(-dt / 0.12)
        damped.current.x += (pointer.current.x * reach - damped.current.x) * damp
        damped.current.y += (-pointer.current.y * reach - damped.current.y) * damp
        plane.style.transform =
          `translate(-50%, -50%) scale(1.16) ` +
          `rotateX(${tilt + damped.current.y}deg) ` +
          `rotateY(${turn + damped.current.x}deg) ` +
          `translateZ(${-depth}px)`
      }

      for (let c = 0; c < trackRefs.current.length; c++) {
        const track = trackRefs.current[c]
        const span = columnSpan[c]?.span
        if (!track || !span) continue

        if (!reduce) {
          /* The held column eases to a stop so its mark can be read. */
          const target = heldColumn.current === c ? 0 : targetSpeeds[c]
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28))
          speeds.current[c] += (target - speeds.current[c]) * ease
          offsets.current[c] =
            (((offsets.current[c] + speeds.current[c] * dt) % span) + span) % span
        }
        track.style.transform = `translate3d(0, ${-offsets.current[c]}px, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      lastFrame.current = null
    }
  }, [columnSpan, depth, parallax, reduce, targetSpeeds, tilt, turn])

  /*
    Tiles move under a still pointer, so :hover latches on whatever was there
    first. A hit test keeps the lit tile the one actually under the cursor.
  */
  const trackPointer = (event: React.PointerEvent) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return

    if (parallax > 0 && !reduce) {
      pointer.current = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      }
    }

    const hit = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-tile]")
    const id = hit?.dataset.tile ?? null
    if (id === litRef.current) return

    litRef.current = id
    heldColumn.current = hit ? Number(hit.dataset.column) : -1
    setLit(id)
  }

  const release = () => {
    pointer.current = { x: 0, y: 0 }
    litRef.current = null
    heldColumn.current = -1
    setLit(null)
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("logo-wall", className)}
      onPointerMove={trackPointer}
      onPointerLeave={release}
      style={
        {
          "--wall-tile": `${tileSize}px`,
          "--wall-gap": `${gap}px`,
          "--wall-perspective": `${perspective}px`,
          "--wall-lift": `${lift}px`,
          "--wall-dim": dim,
          "--wall-edge": `${Math.max(0, (1 - fade) * 100)}%`,
        } as React.CSSProperties
      }
    >
      <div ref={planeRef} className="logo-wall__plane">
        {grid.map((col, c) => (
          <div className="logo-wall__column" key={c}>
            <div
              className="logo-wall__track"
              ref={(el) => {
                trackRefs.current[c] = el
              }}
            >
              {Array.from({ length: columnSpan[c].copies }, (_, copy) =>
                col.map((tile) => {
                  const id = `${tile.id}-${copy}`
                  return (
                    <div
                      key={id}
                      data-tile={id}
                      data-column={c}
                      className={cn("logo-wall__tile", lit === id && "is-lit")}
                    >
                      <span className="logo-wall__plate">
                        {tile.node}
                        <span className="logo-wall__name">{tile.label}</span>
                      </span>
                    </div>
                  )
                }),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
