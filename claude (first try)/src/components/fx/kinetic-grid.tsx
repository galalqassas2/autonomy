"use client"

import * as React from "react"

import { KineticGridEngine } from "./kinetic-grid-engine"

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

    const engine = new KineticGridEngine(ctx)

    const setSize = () => {
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      engine.setSize(rect.width, rect.height, dpr, canvas)
    }

    setSize()

    const resizeObserver = new ResizeObserver(() => {
      setSize()
      if (!engine.running) engine.draw(performance.now())
    })
    resizeObserver.observe(wrap)

    let visible = false
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !document.hidden) engine.start()
        else engine.stop()
      },
      { threshold: 0 },
    )
    intersection.observe(wrap)

    const onVisibility = () => {
      if (document.hidden) engine.stop()
      else if (visible) engine.start()
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onMove = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      engine.setTarget(event.clientX - rect.left, event.clientY - rect.top)
    }
    const onLeave = () => {
      engine.resetTarget()
    }
    const onClick = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      engine.addRipple(event.clientX - rect.left, event.clientY - rect.top)
    }

    wrap.addEventListener("mousemove", onMove)
    wrap.addEventListener("pointerleave", onLeave)
    wrap.addEventListener("click", onClick)

    return () => {
      engine.stop()
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
