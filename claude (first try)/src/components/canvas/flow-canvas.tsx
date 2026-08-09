"use client"

import * as React from "react"

import type { CanvasFlow } from "@/lib/flows"
import { cn } from "@/lib/utils"

import { CanvasConnectors, type EdgeState } from "./canvas-connectors"
import { CanvasNodeCard, type NodeState } from "./canvas-node"
import { CanvasTerminal } from "./canvas-terminal"
import { buildLayout, type LayoutMode } from "./layout"
import { useCanvasZoom } from "./use-canvas-zoom"
import { useFlowRun, type RunSnapshot } from "./use-flow-run"
import { ZoomCluster } from "./zoom-cluster"

export type FlowCanvasHandle = { replay: () => void; fit: () => void }

type Props = {
  flow: CanvasFlow
  mode: LayoutMode
  /* Playback advances only while true. Pausing holds the position. */
  playing: boolean
  loop?: boolean
  still?: boolean
  /* Zoom, pan and the zoom cluster become real controls. */
  zoomable?: boolean
  fitMode?: "none" | "contain" | "width"
  frameHeight: number
  action?: React.ReactNode
  onSnapshot?: (snapshot: RunSnapshot) => void
  className?: string
}

export const FlowCanvas = React.forwardRef<FlowCanvasHandle, Props>(
  function FlowCanvas(
    {
      flow,
      mode,
      playing,
      loop = false,
      still = false,
      zoomable = false,
      fitMode = "none",
      frameHeight,
      action,
      onSnapshot,
      className,
    },
    ref,
  ) {
    const layout = React.useMemo(() => buildLayout(flow, mode), [flow, mode])
    const edges = React.useMemo(
      () => layout.edges.map((edge) => Boolean(edge.d)),
      [layout],
    )

    const { snapshot, replay } = useFlowRun({
      nodes: flow.nodes,
      edges,
      playing,
      loop,
      still,
    })

    const zoom = useCanvasZoom({
      worldW: layout.world.w,
      worldH: layout.world.h,
      enabled: zoomable,
      fitMode,
    })

    React.useImperativeHandle(ref, () => ({ replay, fit: zoom.fit }), [
      replay,
      zoom.fit,
    ])

    React.useEffect(() => {
      onSnapshot?.(snapshot)
    }, [snapshot, onSnapshot])

    const nodeState = (index: number): NodeState => {
      if (index < snapshot.doneCount) return "done"
      if (index === snapshot.activeIndex) return "running"
      return "idle"
    }

    const edgeState = (index: number): EdgeState => {
      if (index < snapshot.drawnCount) return "drawn"
      if (index === snapshot.drawingIndex) return "drawing"
      return "idle"
    }

    return (
      <div
        className={cn(
          "dark-scope overflow-hidden rounded-lg border border-white/[0.10] shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
          className,
        )}
        style={{ background: "var(--canvas-night)" }}
      >
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.08] px-4">
          <span
            className="t-micro rounded-full px-2 py-1 text-primary"
            style={{ background: "var(--primary-a10)" }}
          >
            Automation
          </span>
          <h3 className="t-heading-md truncate text-on-dark">{flow.title}</h3>
          {action ? <div className="ml-auto shrink-0">{action}</div> : null}
        </div>

        <div
          ref={zoom.frameRef}
          tabIndex={zoomable ? 0 : -1}
          role={zoomable ? "application" : undefined}
          aria-label={
            zoomable
              ? `${flow.title} canvas. Use plus and minus to zoom, zero to fit.`
              : undefined
          }
          aria-hidden={zoomable ? undefined : true}
          className="relative overflow-hidden focus-visible:outline-none"
          style={{
            height: frameHeight,
            background: "var(--canvas-night-2)",
            cursor: zoom.cursor,
            touchAction: zoomable ? "pan-y" : undefined,
          }}
          {...(zoomable ? zoom.frameProps : {})}
        >
          {/* 24px dot grid, plus one soft emerald wash from the upper left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(var(--white-a06) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(680px 420px at 12% 0%, var(--primary-a06), transparent 70%)",
            }}
          />

          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: layout.world.w,
              height: layout.world.h,
              transform: `translate3d(${zoom.view.x}px, ${zoom.view.y}px, 0) scale(${zoom.view.scale})`,
            }}
          >
            <CanvasConnectors layout={layout} stateFor={edgeState} />

            {layout.start ? (
              <CanvasTerminal
                kind="Start"
                x={layout.start.x}
                y={layout.start.y}
                active={snapshot.drawnCount > 0 || snapshot.drawingIndex === 0}
              />
            ) : null}

            {flow.nodes.map((node, i) => {
              const placed = layout.nodes[i]
              return (
                <CanvasNodeCard
                  key={node.id}
                  node={node}
                  state={nodeState(i)}
                  x={placed.x}
                  y={placed.y}
                />
              )
            })}

            {layout.end ? (
              <CanvasTerminal
                kind="End"
                x={layout.end.x}
                y={layout.end.y}
                active={snapshot.finished}
              />
            ) : null}
          </div>

          <ZoomCluster
            percent={zoom.percent}
            interactive={zoomable}
            canZoomIn={zoom.canZoomIn}
            canZoomOut={zoom.canZoomOut}
            onZoomIn={zoom.zoomIn}
            onZoomOut={zoom.zoomOut}
            onFit={zoom.fit}
          />
        </div>
      </div>
    )
  },
)
