"use client"

import * as React from "react"
import { useGesture } from "@use-gesture/react"

import { ToolMark } from "@/components/blocks/capability-widgets/tool-mark"
import type { Tool } from "@/lib/tools"
import { useIsoLayoutEffect } from "@/lib/use-iso-layout-effect"

import "./dome-gallery.css"

/* ── Types ─────────────────────────────────────────────── */

export type DomeTile = {
  id: string
  label: string
  node?: React.ReactNode
}

export type DomeGalleryProps = {
  tools?: Tool[]
  tiles?: DomeTile[]
  onSelectTool?: (tool: Tool) => void
  onOpen?: (id: string) => void
  openId?: string | null
  /** Sphere radius as fraction of container short side. */
  fit?: number
  /** Max pitch angle in degrees. */
  maxPitch?: number
  /** Drag dampening 1-10. */
  dampening?: number
}

/* ── Layout ────────────────────────────────────────────── */

const BAND_COUNT = 7
const TARGET_PER_BAND = 14

function buildSlots(pool: DomeTile[]) {
  if (pool.length === 0) return []

  const slots: { lonDeg: number; latDeg: number; tile: DomeTile }[] = []
  let idx = 0

  for (let b = 0; b < BAND_COUNT; b++) {
    const latFrac = (b + 0.5) / BAND_COUNT - 0.5
    const latDeg = latFrac * 150                             // ±75° spread
    const density = Math.cos((latDeg * Math.PI) / 180)
    const count = Math.max(4, Math.round(TARGET_PER_BAND * density))

    for (let c = 0; c < count; c++) {
      const lonDeg = (360 / count) * c + (b % 2 === 0 ? 0 : 360 / count / 2)
      slots.push({ lonDeg, latDeg, tile: pool[idx % pool.length] })
      idx++
    }
  }
  return slots
}

/* ── Helpers ───────────────────────────────────────────── */

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const wrapDeg = (d: number) => ((d % 360) + 540) % 360 - 180

/* ── Component ─────────────────────────────────────────── */

export function DomeGallery({
  tools,
  tiles,
  onSelectTool,
  onOpen,
  openId,
  fit = 0.48,
  maxPitch = 20,
  dampening = 5,
}: DomeGalleryProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const mainRef = React.useRef<HTMLDivElement>(null)
  const worldRef = React.useRef<HTMLDivElement>(null)

  const rotRef = React.useRef({ x: 0, y: 0 })
  const dragStart = React.useRef({ x: 0, y: 0, rx: 0, ry: 0 })
  const draggingRef = React.useRef(false)
  const movedRef = React.useRef(false)
  const rafRef = React.useRef<number | null>(null)

  /* Normalize input */
  const pool = React.useMemo<DomeTile[]>(() => {
    if (tiles && tiles.length > 0) return tiles
    if (tools && tools.length > 0) {
      return tools.map((t) => ({
        id: t.slug,
        label: t.name,
        node: <ToolMark slug={t.slug} className="size-full" />,
      }))
    }
    return []
  }, [tiles, tools])

  const slots = React.useMemo(() => buildSlots(pool), [pool])

  /* ── Sizing ──── */
  const [tileSize, setTileSize] = React.useState(0)

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect
      const short = Math.min(w, h)
      const radius = Math.max(120, Math.round(short * fit))
      const perspective = radius * 2.4
      const tile = Math.max(36, Math.round(radius * 0.34))

      root.style.setProperty("--radius", `${radius}px`)
      root.style.setProperty("--perspective", `${perspective}px`)
      setTileSize(tile)
    })

    ro.observe(root)
    return () => ro.disconnect()
  }, [fit])

  /* ── Transform ──── */
  const applyTransform = React.useCallback((rx: number, ry: number) => {
    const el = worldRef.current
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
  }, [])

  React.useEffect(() => {
    applyTransform(rotRef.current.x, rotRef.current.y)
  }, [applyTransform])

  /* ── Inertia ──── */
  const stopInertia = React.useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startInertia = React.useCallback(
    (vx: number, vy: number) => {
      let velX = clamp(vx, -120, 120)
      let velY = clamp(vy, -120, 120)
      const friction = 0.94 - clamp(dampening, 1, 10) * 0.004

      const tick = () => {
        velX *= friction
        velY *= friction
        if (Math.abs(velX) < 0.05 && Math.abs(velY) < 0.05) { rafRef.current = null; return }

        const r = rotRef.current
        const nx = clamp(r.x - velY * 0.016, -maxPitch, maxPitch)
        const ny = wrapDeg(r.y + velX * 0.016)
        rotRef.current = { x: nx, y: ny }
        applyTransform(nx, ny)
        rafRef.current = requestAnimationFrame(tick)
      }

      stopInertia()
      rafRef.current = requestAnimationFrame(tick)
    },
    [dampening, maxPitch, stopInertia, applyTransform],
  )

  /* ── Gesture ──── */
  useGesture(
    {
      onDragStart: ({ event }) => {
        stopInertia()
        const e = event as PointerEvent
        draggingRef.current = true
        movedRef.current = false
        dragStart.current = { x: e.clientX, y: e.clientY, rx: rotRef.current.x, ry: rotRef.current.y }
      },
      onDrag: ({ event, last, velocity, direction }) => {
        if (!draggingRef.current) return
        const e = event as PointerEvent
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y

        if (!movedRef.current && dx * dx + dy * dy > 16) movedRef.current = true

        const sens = 18
        const nx = clamp(dragStart.current.rx - dy / sens, -maxPitch, maxPitch)
        const ny = wrapDeg(dragStart.current.ry + dx / sens)
        rotRef.current = { x: nx, y: ny }
        applyTransform(nx, ny)

        if (last) {
          draggingRef.current = false
          if (velocity && direction) {
            const [vMag] = velocity
            const [dirX, dirY] = direction
            if (vMag > 0.1) startInertia(vMag * dirX * 80, vMag * dirY * 80)
          }
          movedRef.current = false
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } },
  )

  /* ── Click ──── */
  const handleClick = React.useCallback(
    (tile: DomeTile) => {
      if (movedRef.current) return
      onOpen?.(tile.id)
      if (onSelectTool && tools) {
        const found = tools.find((t) => t.slug === tile.id)
        if (found) onSelectTool(found)
      }
    },
    [onOpen, onSelectTool, tools],
  )

  if (pool.length === 0) return null

  const ready = tileSize > 0

  return (
    <div
      ref={rootRef}
      className="sphere-root"
    >
      <div ref={mainRef} className="sphere-main" style={ready ? undefined : { visibility: "hidden" }}>
        <div className="sphere-stage">
          <div ref={worldRef} className="sphere-world">
            {ready && slots.map((slot, i) => (
              <div
                key={`${slot.lonDeg}-${slot.latDeg}-${i}`}
                className="sphere-slot"
                style={{
                  width: tileSize,
                  height: tileSize,
                  margin: tileSize / -2,
                  transform: `rotateY(${slot.lonDeg}deg) rotateX(${slot.latDeg}deg) translateZ(var(--radius))`,
                }}
              >
                <div
                  className="sphere-tile"
                  role="button"
                  tabIndex={0}
                  aria-label={`${slot.tile.label} integration`}
                  data-lit={openId === slot.tile.id || undefined}
                  onClick={() => handleClick(slot.tile)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleClick(slot.tile)
                    }
                  }}
                >
                  {slot.tile.node ?? (
                    <ToolMark slug={slot.tile.id} className="size-full" />
                  )}
                  <span className="sphere-tile__label">{slot.tile.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
