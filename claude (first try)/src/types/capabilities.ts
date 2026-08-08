export type ChatTurn =
  | { kind: "them"; text: string }
  | { kind: "us"; text: string }
  | { kind: "card"; title: string; meta: string; value: string }
  | { kind: "chips"; options: [string, string] }

export type Widget =
  /* A conversation. Only for jobs that really are a conversation. */
  | {
      kind: "chat"
      channel: "whatsapp" | "telegram" | "web"
      account: string
      turns: ChatTurn[]
    }
  /* The document itself, drawn and then stamped paid. */
  | {
      kind: "invoice"
      billedTo: string
      lines: { desc: string; detail: string; amount: string }[]
      totals: { label: string; value: string; strong?: boolean }[]
      stamp: string
    }
  /* Something unstructured in, structured fields out. */
  | {
      kind: "extract"
      source: { tool: string; title: string; meta: string }
      raw: string
      fields: { label: string; value: string }[]
      filedTo: { tool: string; text: string }
    }
  /* A record being classified, enriched and handed to someone. */
  | {
      kind: "record"
      header: { tool: string; title: string; meta: string }
      chips: { label: string; value: string; hot?: boolean }[]
      fields: { label: string; value: string }[]
      handoff: { tool: string; text: string }
    }
  /* A support request, its classification and the reply prepared for approval. */
  | {
      kind: "ticket"
      header: { tool: string; title: string; meta: string }
      message: string
      fields: { label: string; value: string }[]
      draft: string
      handoff: { tool: string; text: string }
    }
  /* Stock levels crossing a reorder point, then the order that follows. */
  | {
      kind: "stock"
      rows: { sku: string; on: number; reorder: number }[]
      order: { tool: string; title: string; detail: string }
    }
  /* One trigger provisioning a list of systems. */
  | {
      kind: "checklist"
      header: { tool: string; title: string; meta: string }
      rows: { system: string; task: string }[]
    }
  /* Numbers posted into a channel. */
  | {
      kind: "report"
      tool: string
      title: string
      metrics: {
        label: string
        value: string
        delta: string
        up: boolean
        /* Whether that direction is good news, which drives the colour. */
        good: boolean
      }[]
      note: string
    }

export type Capability = {
  id: string
  label: string
  team: string
  /* Shown as a logo stack on the card. This is the breadth argument. */
  tools: string[]
  impact: string
  widget: Widget
}
