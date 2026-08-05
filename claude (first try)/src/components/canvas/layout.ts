import type { CanvasFlow } from "@/lib/flows"

export const NODE_W = 260
export const NODE_H = 116
export const TERM = 96
const PAD = 44
const GAP_X = 88
const ROW_Y = 190

export type Placed = { id: string; x: number; y: number; w: number; h: number }
export type Port = { x: number; y: number }
export type Edge = { id: string; d: string; ports: Port[] }
export type CanvasLayout = {
  world: { w: number; h: number }
  nodes: Placed[]
  start: Placed | null
  end: Placed | null
  /* edges[i] is the connector that arrives at nodes[i], so index maps to step. */
  edges: Edge[]
}

const cx = (p: Placed) => p.x + p.w / 2
const cy = (p: Placed) => p.y + p.h / 2

function edge(id: string, p1: Port, p2: Port, d: string): Edge {
  return { id, d, ports: [p1, p2] }
}

function horizontal(id: string, a: Placed, b: Placed, reversed: boolean): Edge {
  const p1 = { x: reversed ? a.x : a.x + a.w, y: cy(a) }
  const p2 = { x: reversed ? b.x + b.w : b.x, y: cy(b) }
  const bend = Math.abs(p2.x - p1.x) * 0.42
  const c = reversed ? -bend : bend
  return edge(
    id,
    p1,
    p2,
    `M ${p1.x} ${p1.y} C ${p1.x + c} ${p1.y}, ${p2.x - c} ${p2.y}, ${p2.x} ${p2.y}`,
  )
}

function vertical(id: string, a: Placed, b: Placed, bendRatio = 0.55): Edge {
  const p1 = { x: cx(a), y: a.y + a.h }
  const p2 = { x: cx(b), y: b.y }
  const bend = Math.abs(p2.y - p1.y) * bendRatio
  return edge(
    id,
    p1,
    p2,
    `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + bend}, ${p2.x} ${p2.y - bend}, ${p2.x} ${p2.y}`,
  )
}

/*
  Serpentine. Row A runs left to right and carries the start terminal,
  row B runs right to left and ends on the end terminal, so the turn
  between them is a short vertical drop rather than a long sweep back.
*/
function serpentine(flow: CanvasFlow): CanvasLayout {
  const rowATop = PAD
  const rowBTop = PAD + ROW_Y
  const termOffset = (NODE_H - TERM) / 2

  const start: Placed = {
    id: "start",
    x: PAD,
    y: rowATop + termOffset,
    w: TERM,
    h: TERM,
  }
  const xAfterStart = PAD + TERM + GAP_X

  const nodes: Placed[] = flow.nodes.map((node, i) => {
    if (i < 2) {
      return {
        id: node.id,
        x: xAfterStart + i * (NODE_W + GAP_X),
        y: rowATop,
        w: NODE_W,
        h: NODE_H,
      }
    }
    /* Row B is laid out right to left: index 2 sits under index 1. */
    return {
      id: node.id,
      x: xAfterStart + (3 - i) * (NODE_W + GAP_X),
      y: rowBTop,
      w: NODE_W,
      h: NODE_H,
    }
  })

  const end: Placed = {
    id: "end",
    x: PAD,
    y: rowBTop + termOffset,
    w: TERM,
    h: TERM,
  }

  const edges: Edge[] = [
    horizontal("e0", start, nodes[0], false),
    horizontal("e1", nodes[0], nodes[1], false),
    vertical("e2", nodes[1], nodes[2]),
    horizontal("e3", nodes[2], nodes[3], true),
    horizontal("e4", nodes[3], end, true),
  ]

  const w = xAfterStart + 2 * NODE_W + GAP_X + PAD
  const h = rowBTop + NODE_H + PAD
  return { world: { w, h }, nodes, start, end, edges }
}

/* Vertical stack. Used under 768px, where the serpentine cannot breathe. */
function stack(flow: CanvasFlow): CanvasLayout {
  const gap = 56
  const nodes: Placed[] = flow.nodes.map((node, i) => ({
    id: node.id,
    x: PAD,
    y: PAD + i * (NODE_H + gap),
    w: NODE_W,
    h: NODE_H,
  }))

  const edges: Edge[] = [
    { id: "s0", d: "", ports: [] },
    ...nodes.slice(1).map((_, i) => vertical(`s${i + 1}`, nodes[i], nodes[i + 1])),
  ]

  return {
    world: {
      w: PAD * 2 + NODE_W,
      h: PAD * 2 + nodes.length * NODE_H + (nodes.length - 1) * gap,
    },
    nodes,
    start: null,
    end: null,
    edges,
  }
}

/* Compact cascade for the hero: three nodes stepping down and across. */
function cascade(flow: CanvasFlow): CanvasLayout {
  const stepX = 92
  const stepY = 138
  const nodes: Placed[] = flow.nodes.map((node, i) => ({
    id: node.id,
    x: PAD + i * stepX,
    y: PAD + i * stepY,
    w: NODE_W,
    h: NODE_H,
  }))

  const edges: Edge[] = [
    { id: "c0", d: "", ports: [] },
    vertical("c1", nodes[0], nodes[1], 0.62),
    vertical("c2", nodes[1], nodes[2], 0.62),
  ]

  const w = PAD * 2 + (nodes.length - 1) * stepX + NODE_W
  const h = PAD * 2 + (nodes.length - 1) * stepY + NODE_H
  return { world: { w, h }, nodes, start: null, end: null, edges }
}

export type LayoutMode = "serpentine" | "cascade" | "stack"

export function buildLayout(flow: CanvasFlow, mode: LayoutMode): CanvasLayout {
  if (mode === "cascade") return cascade(flow)
  if (mode === "stack") return stack(flow)
  return serpentine(flow)
}
