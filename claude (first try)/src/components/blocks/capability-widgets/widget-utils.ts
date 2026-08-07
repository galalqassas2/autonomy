import type { Widget } from "@/lib/capabilities"

export const AMBER = "#e0b05a"

/* How many reveals each widget has, and where the model does the thinking. */
export function widgetSteps(w: Widget) {
  switch (w.kind) {
    case "chat":
      return w.turns.length
    case "invoice":
      return w.lines.length + 2
    case "extract":
      return 1 + w.fields.length + 1
    case "record":
      return 2 + w.fields.length + 1
    case "stock":
      return w.rows.length + 1
    case "checklist":
      return w.rows.length + 1
    case "report":
      return w.metrics.length + 1
  }
}

export function widgetThinksAt(w: Widget, i: number) {
  if (w.kind === "chat") return w.turns[i].kind !== "them"
  if (w.kind === "extract" || w.kind === "record") return i === 1
  return false
}
