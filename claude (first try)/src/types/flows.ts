export type CanvasRow = {
  label: string
  value: string
  tone?: "default" | "warn"
}

export type CanvasNode = {
  id: string
  type: string
  chip?: string
  rows: CanvasRow[]
  chips?: string[]
  ms: number
}

export type CanvasFlow = {
  id: string
  title: string
  nodes: CanvasNode[]
  totalLabel: string
}

export type RunLogLine = {
  clock: string
  event: string
  delta: string
}

export type Department = {
  id: string
  tab: string
  outcome: string
  flow: CanvasFlow | null
}
