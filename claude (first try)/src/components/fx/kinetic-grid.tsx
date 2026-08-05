"use client"

import * as React from "react"

type Point = { x: number; y: number }
type Ripple = { x: number; y: number; radius: number; opacity: number; born: number }

const INFLUENCE_RADIUS = 260
const MAX_WARP = 24
const DOT_SPACING = 28
const LERP_SPEED = 0.08
const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 }
const NODE_BASE_RADIUS = 1.8
const NODE_ACTIVE_RADIUS = 3.2
const AWAY = -9999

const THEME = {
  bg: "#1c1c1c",
  lineActive: { r: 62, g: 207, b: 142, a: 0.85 },
  nodeActive: { r: 62, g: 207, b: 142, a: 1.0 },
  glow: "62,207,142",
  ripple: "62,207,142",
}

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number,
) {
  const r = Math.round(lerpN(base.r, active.r, t))
  const g = Math.round(lerpN(base.g, active.g, t))
  const b = Math.round(lerpN(base.b, active.b, t))
  return `rgba(${r},${g},${b},${lerpN(base.a, active.a, t).toFixed(3)})`
}

/* 72 on desktop, 96 on tablet. Node count falls quadratically. */
function cellSize(width: number) {
  return width < 1024 ? 96 : 72
}

/*
  Container background of warping grid lines. Scoped to its wrapper: it
  measures the wrapper, listens on the wrapper, and stops when the wrapper
  is off screen or the tab is hidden.
*/
export default function KineticGrid() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mouse: Point = { x: AWAY, y: AWAY }
    const target: Point = { x: AWAY, y: AWAY }
    const ripples: Ripple[] = []
    const size = { w: 0, h: 0 }

    /* Reused across frames, reallocated only when the grid shape changes. */
    let pts: Point[][] = []
    let prox: number[][] = []
    let cols = 0
    let rows = 0

    const ensureGrid = (nextCols: number, nextRows: number) => {
      if (nextCols === cols && nextRows === rows) return
      cols = nextCols
      rows = nextRows
      pts = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ x: 0, y: 0 })),
      )
      prox = Array.from({ length: rows }, () => new Array<number>(cols).fill(0))
    }

    const setSize = () => {
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      size.w = rect.width
      size.h = rect.height
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      const { w: W, h: H } = size
      if (!W || !H) return

      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = THEME.bg
      ctx.fillRect(0, 0, W, H)

      ctx.fillStyle = "rgba(255,255,255,0.05)"
      for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          ctx.beginPath()
          ctx.arc(x, y, 0.7, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        const age = (now - r.born) / 1000
        r.radius = Math.max(0, age * 400)
        r.opacity = Math.max(0, 1 - age * 1.2)
        if (r.opacity <= 0) ripples.splice(i, 1)
      }

      const cell = cellSize(W)
      ensureGrid(
        Math.max(2, Math.ceil(W / cell)) + 1,
        Math.max(2, Math.ceil(H / cell)) + 1,
      )
      const cellW = W / (cols - 1)
      const cellH = H / (rows - 1)
      const edgeMargin = 1.5

      for (let row = 0; row < rows; row++) {
        const colPinRow = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1)
        for (let col = 0; col < cols; col++) {
          const gx = col * cellW
          const gy = row * cellH
          const colPin = Math.min(
            col / edgeMargin,
            (cols - 1 - col) / edgeMargin,
            1,
          )
          const pin = colPin * colPin * colPinRow * colPinRow

          const dx = gx - mouse.x
          const dy = gy - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          let rx = 0
          let ry = 0
          for (const r of ripples) {
            const rdx = gx - r.x
            const rdy = gy - r.y
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
            const diff = rdist - r.radius
            if (Math.abs(diff) < 55) {
              const strength = (1 - Math.abs(diff) / 55) * r.opacity * 18 * pin
              const angle = Math.atan2(rdy, rdx)
              const sign = diff < 0 ? 1 : -1
              rx += Math.cos(angle) * strength * sign
              ry += Math.sin(angle) * strength * sign
            }
          }

          const point = pts[row][col]
          if (dist < INFLUENCE_RADIUS && dist > 0 && pin > 0) {
            const t = dist / INFLUENCE_RADIUS
            const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60)
            const warp = eased * MAX_WARP * pin
            const angle = Math.atan2(dy, dx)
            point.x = gx - Math.cos(angle) * warp + rx
            point.y = gy - Math.sin(angle) * warp + ry
          } else {
            point.x = gx + rx
            point.y = gy + ry
          }
          prox[row][col] = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pin
        }
      }

      const segment = (p1: Point, p2: Point, pr1: number, pr2: number) => {
        const avg = (pr1 + pr2) / 2
        const t = avg * avg * (3 - 2 * avg)
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = lerpColor(LINE_BASE, THEME.lineActive, t)
        ctx.lineWidth = lerpN(0.8, 1.5, t)
        ctx.stroke()
      }

      ctx.lineCap = "butt"
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 1; col++) {
          segment(pts[row][col], pts[row][col + 1], prox[row][col], prox[row][col + 1])
        }
      }
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows - 1; row++) {
          segment(pts[row][col], pts[row + 1][col], prox[row][col], prox[row + 1][col])
        }
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = pts[row][col]
          const pr = prox[row][col]
          const t = pr * pr * (3 - 2 * pr)
          const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t)

          if (t > 0.3) {
            const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7)
            const grd = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR)
            grd.addColorStop(0, `rgba(${THEME.glow},${(t * 0.3).toFixed(3)})`)
            grd.addColorStop(1, `rgba(${THEME.glow},0)`)
            ctx.beginPath()
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
            ctx.fillStyle = grd
            ctx.fill()
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = lerpColor({ r: 255, g: 255, b: 255, a: 0.2 }, THEME.nodeActive, t)
          ctx.fill()
        }
      }

      for (const r of ripples) {
        ctx.beginPath()
        ctx.arc(r.x, r.y, Math.max(0, r.radius), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${THEME.ripple},${(r.opacity * 0.28).toFixed(3)})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    let frame = 0
    let running = false

    const loop = (now: number) => {
      mouse.x = lerpN(mouse.x, target.x, LERP_SPEED)
      mouse.y = lerpN(mouse.y, target.y, LERP_SPEED)
      draw(now)
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(frame)
    }

    setSize()

    const resizeObserver = new ResizeObserver(() => {
      setSize()
      if (!running) draw(performance.now())
    })
    resizeObserver.observe(wrap)

    let visible = false
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !document.hidden) start()
        else stop()
      },
      { threshold: 0 },
    )
    intersection.observe(wrap)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onMove = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
    }
    const onLeave = () => {
      target.x = AWAY
      target.y = AWAY
    }
    const onClick = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      ripples.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      })
    }

    wrap.addEventListener("mousemove", onMove)
    wrap.addEventListener("pointerleave", onLeave)
    wrap.addEventListener("click", onClick)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      wrap.removeEventListener("mousemove", onMove)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("click", onClick)
    }
  }, [])

  return (
    <div ref={wrapRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
    </div>
  )
}
