"use client"

import * as React from "react"

const MIN = 0.5
const MAX = 1.5
const STEP = 0.1

type Options = {
  worldW: number
  worldH: number
  /* Decorative canvases render at a fixed scale and take no input. */
  enabled: boolean
  /*
    How the view starts, and how it re-settles on resize until the user
    touches the controls. "none" starts at 100 percent.
  */
  fitMode?: "none" | "contain" | "width"
}

type View = { scale: number; x: number; y: number }

const round = (n: number) => Math.round(n * 100) / 100

function clampView(
  view: View,
  frame: { w: number; h: number },
  world: { w: number; h: number },
): View {
  const sw = world.w * view.scale
  const sh = world.h * view.scale
  const x =
    sw <= frame.w
      ? (frame.w - sw) / 2
      : Math.min(0, Math.max(frame.w - sw, view.x))
  const y =
    sh <= frame.h
      ? (frame.h - sh) / 2
      : Math.min(0, Math.max(frame.h - sh, view.y))
  return { scale: view.scale, x, y }
}

export function useCanvasZoom({
  worldW,
  worldH,
  enabled,
  fitMode = "none",
}: Options) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const frameSize = React.useRef({ w: 0, h: 0 })
  const world = React.useMemo(() => ({ w: worldW, h: worldH }), [worldW, worldH])

  const [view, setView] = React.useState<View>({ scale: 1, x: 0, y: 0 })
  const [grabbing, setGrabbing] = React.useState(false)
  const viewRef = React.useRef(view)
  const touched = React.useRef(false)
  viewRef.current = view

  const autoScale = React.useCallback(() => {
    const { w, h } = frameSize.current
    if (!w || !h || fitMode === "none") return 1
    const byWidth = w / world.w
    return fitMode === "width"
      ? Math.min(1, byWidth)
      : Math.min(1, byWidth, h / world.h)
  }, [fitMode, world])

  const pointers = React.useRef(new Map<number, { x: number; y: number }>())
  const pinch = React.useRef<{ dist: number; scale: number } | null>(null)
  const drag = React.useRef<{ x: number; y: number; vx: number; vy: number } | null>(
    null,
  )

  const apply = React.useCallback(
    (next: View) => setView(clampView(next, frameSize.current, world)),
    [world],
  )

  /* Fit returns to 100 percent and recentres, per section 4.3. */
  const fit = React.useCallback(() => {
    touched.current = false
    apply({ scale: 1, x: 0, y: 0 })
  }, [apply])

  /* Zoom about a point in frame coordinates so that point stays put. */
  const zoomAt = React.useCallback(
    (nextScale: number, px: number, py: number) => {
      const v = viewRef.current
      const scale = round(Math.min(MAX, Math.max(MIN, nextScale)))
      if (scale === v.scale) return
      touched.current = true
      const k = scale / v.scale
      apply({ scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k })
    },
    [apply],
  )

  const zoomByStep = React.useCallback(
    (direction: 1 | -1) => {
      const { w, h } = frameSize.current
      zoomAt(viewRef.current.scale + direction * STEP, w / 2, h / 2)
    },
    [zoomAt],
  )

  /* Keep the frame measurement current, and recentre when it changes. */
  React.useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => {
      frameSize.current = {
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      }
      setView((v) =>
        clampView(
          touched.current ? v : { scale: autoScale(), x: 0, y: 0 },
          frameSize.current,
          world,
        ),
      )
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [world, autoScale])

  React.useEffect(() => {
    const frame = frameRef.current
    if (!frame || !enabled) return

    /*
      A plain wheel must never be captured: the page has to keep scrolling
      when the pointer is over the canvas. Only a modified wheel zooms.
    */
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = frame.getBoundingClientRect()
      const factor = Math.exp(-event.deltaY * 0.002)
      zoomAt(
        viewRef.current.scale * factor,
        event.clientX - rect.left,
        event.clientY - rect.top,
      )
    }

    frame.addEventListener("wheel", onWheel, { passive: false })
    return () => frame.removeEventListener("wheel", onWheel)
  }, [enabled, zoomAt])

  const canPan = React.useCallback(() => {
    const v = viewRef.current
    return (
      world.w * v.scale > frameSize.current.w + 1 ||
      world.h * v.scale > frameSize.current.h + 1
    )
  }, [world])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    /*
      The zoom cluster sits inside the frame. Starting a pan from it would
      capture the pointer and swallow the button's click, which is what made
      the controls stop responding once the content grew past the frame.
    */
    if ((event.target as HTMLElement).closest("[data-canvas-control]")) return

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale: viewRef.current.scale,
      }
      drag.current = null
      setGrabbing(false)
      return
    }

    /* One finger scrolls the page, so only a mouse starts a drag pan. */
    if (event.pointerType === "mouse" && canPan()) {
      const v = viewRef.current
      drag.current = { x: event.clientX, y: event.clientY, vx: v.x, vy: v.y }
      event.currentTarget.setPointerCapture(event.pointerId)
      setGrabbing(true)
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })

    if (pinch.current && pointers.current.size === 2) {
      const frame = frameRef.current
      if (!frame) return
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const rect = frame.getBoundingClientRect()
      zoomAt(
        (pinch.current.scale * dist) / pinch.current.dist,
        (a.x + b.x) / 2 - rect.left,
        (a.y + b.y) / 2 - rect.top,
      )
      return
    }

    if (drag.current) {
      const v = viewRef.current
      touched.current = true
      apply({
        scale: v.scale,
        x: drag.current.vx + (event.clientX - drag.current.x),
        y: drag.current.vy + (event.clientY - drag.current.y),
      })
    }
  }

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (pointers.current.size === 0) {
      drag.current = null
      setGrabbing(false)
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!enabled) return
    if (event.key === "+" || event.key === "=") {
      event.preventDefault()
      zoomByStep(1)
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault()
      zoomByStep(-1)
    } else if (event.key === "0") {
      event.preventDefault()
      fit()
    }
  }

  const pannable = enabled && canPan()

  return {
    frameRef,
    view,
    percent: Math.round(view.scale * 100),
    canZoomIn: view.scale < MAX,
    canZoomOut: view.scale > MIN,
    zoomIn: () => zoomByStep(1),
    zoomOut: () => zoomByStep(-1),
    fit,
    frameProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
      onKeyDown,
    },
    cursor: !pannable ? "default" : grabbing ? "grabbing" : "grab",
  }
}
