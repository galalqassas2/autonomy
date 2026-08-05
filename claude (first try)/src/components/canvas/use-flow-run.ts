"use client"

import * as React from "react"

import type { CanvasNode } from "@/lib/flows"

const EDGE_MS = 520
const BASE_RUN = 900
const SETTLE_MS = 200
const LOOP_HOLD_MS = 1600

export type RunSnapshot = {
  /* Index of the node currently running, or -1. */
  activeIndex: number
  /* How many nodes have finished. */
  doneCount: number
  /* Index of the connector currently drawing, or -1. */
  drawingIndex: number
  /* One past the highest connector index that has finished drawing. */
  drawnCount: number
  finished: boolean
}

type Marker = { at: number; snapshot: RunSnapshot }

const IDLE: RunSnapshot = {
  activeIndex: -1,
  doneCount: 0,
  drawingIndex: -1,
  drawnCount: 0,
  finished: false,
}

/*
  edges[i] says whether a connector arrives at nodes[i]. One extra entry
  past the node count is the connector into the end terminal.
*/
function buildTimeline(nodes: CanvasNode[], edges: boolean[]) {
  const markers: Marker[] = [{ at: 0, snapshot: IDLE }]
  let t = 0
  let drawn = 0
  let done = 0

  const push = (snapshot: RunSnapshot) => markers.push({ at: t, snapshot })

  const drawEdge = (index: number) => {
    push({
      activeIndex: -1,
      doneCount: done,
      drawingIndex: index,
      drawnCount: drawn,
      finished: false,
    })
    t += EDGE_MS
    drawn = index + 1
  }

  nodes.forEach((node, i) => {
    if (edges[i]) drawEdge(i)
    push({
      activeIndex: i,
      doneCount: done,
      drawingIndex: -1,
      drawnCount: drawn,
      finished: false,
    })
    t += BASE_RUN + node.ms
    done += 1
    push({
      activeIndex: -1,
      doneCount: done,
      drawingIndex: -1,
      drawnCount: drawn,
      finished: false,
    })
    t += SETTLE_MS
  })

  if (edges[nodes.length]) drawEdge(nodes.length)

  const complete: RunSnapshot = {
    activeIndex: -1,
    doneCount: done,
    drawingIndex: -1,
    drawnCount: drawn,
    finished: true,
  }
  push(complete)

  return { markers, duration: t, complete }
}

function same(a: RunSnapshot, b: RunSnapshot) {
  return (
    a.activeIndex === b.activeIndex &&
    a.doneCount === b.doneCount &&
    a.drawingIndex === b.drawingIndex &&
    a.drawnCount === b.drawnCount &&
    a.finished === b.finished
  )
}

type Options = {
  nodes: CanvasNode[]
  edges: boolean[]
  /* Playback advances only while this is true. Pausing holds the position. */
  playing: boolean
  loop?: boolean
  /* Skips playback and renders the run as already complete. */
  still?: boolean
}

export function useFlowRun({
  nodes,
  edges,
  playing,
  loop = false,
  still = false,
}: Options) {
  const key = edges.join(",")
  const timeline = React.useMemo(
    () => buildTimeline(nodes, key.split(",").map((v) => v === "true")),
    [nodes, key],
  )

  const [snapshot, setSnapshot] = React.useState<RunSnapshot>(IDLE)
  const elapsedRef = React.useRef(0)
  const snapshotRef = React.useRef(snapshot)
  const [runId, setRunId] = React.useState(0)

  snapshotRef.current = snapshot

  const replay = React.useCallback(() => {
    elapsedRef.current = 0
    snapshotRef.current = IDLE
    setSnapshot(IDLE)
    setRunId((n) => n + 1)
  }, [])

  React.useEffect(() => {
    if (still) {
      elapsedRef.current = timeline.duration
      snapshotRef.current = timeline.complete
      setSnapshot(timeline.complete)
      return
    }
    if (!playing) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      elapsedRef.current += now - last
      last = now

      if (loop && elapsedRef.current > timeline.duration + LOOP_HOLD_MS) {
        elapsedRef.current = 0
      }

      const t = Math.min(elapsedRef.current, timeline.duration)
      let next = timeline.markers[0].snapshot
      for (const marker of timeline.markers) {
        if (marker.at <= t) next = marker.snapshot
        else break
      }

      if (!same(next, snapshotRef.current)) {
        snapshotRef.current = next
        setSnapshot(next)
      }

      if (loop || elapsedRef.current < timeline.duration) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, loop, still, timeline, runId])

  return { snapshot, replay, duration: timeline.duration }
}
