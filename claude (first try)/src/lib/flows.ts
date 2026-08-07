import type { CanvasFlow, Department, RunLogLine } from "@/types/flows"
export type { CanvasFlow, CanvasNode, CanvasRow, Department, RunLogLine } from "@/types/flows"

/* The flow that plays in the automation stage, and the one the hero teases. */
export const orderToInvoice: CanvasFlow = {
  id: "order-to-invoice",
  title: "Order to invoice",
  totalLabel: "1.2 seconds",
  nodes: [
    {
      id: "order",
      type: "Trigger",
      chip: "Store",
      ms: 300,
      rows: [
        { label: "Source", value: "Online store" },
        { label: "Payment", value: "Confirmed" },
      ],
    },
    {
      id: "stock",
      type: "Data",
      ms: 400,
      rows: [
        { label: "Availability", value: "In stock" },
        { label: "Location", value: "Main warehouse" },
      ],
    },
    {
      id: "invoice",
      type: "Action",
      chip: "Accounts",
      ms: 200,
      rows: [
        { label: "Document", value: "Invoice" },
        { label: "Delivery", value: "Email" },
      ],
    },
    {
      id: "notify",
      type: "Action",
      chip: "Chat",
      ms: 300,
      rows: [
        { label: "Channel", value: "Operations" },
        { label: "State", value: "Done" },
      ],
    },
  ],
}

/* Deltas add up to the 1.2 seconds the stage reports. */
export const orderToInvoiceLog: RunLogLine[] = [
  { clock: "09:41:02", event: "Order received from your store", delta: "+0.3s" },
  { clock: "09:41:02", event: "Stock checked, item available", delta: "+0.4s" },
  { clock: "09:41:03", event: "Invoice created and sent", delta: "+0.2s" },
  { clock: "09:41:03", event: "Operations notified", delta: "+0.3s" },
]

export const departments: Department[] = [
  {
    id: "finance",
    tab: "Finance",
    outcome:
      "can issue and chase invoices without opening a spreadsheet",
    flow: {
      id: "invoice-run",
      title: "Invoice run",
      totalLabel: "",
      nodes: [
        {
          id: "due",
          type: "Trigger",
          ms: 260,
          rows: [
            { label: "Runs", value: "On the billing date" },
            { label: "Source", value: "Your ledger" },
          ],
        },
        {
          id: "gather",
          type: "Data",
          ms: 320,
          rows: [
            { label: "Scope", value: "Unpaid accounts" },
            { label: "Grouped by", value: "Customer" },
          ],
        },
        {
          id: "issue",
          type: "Action",
          chip: "Accounts",
          ms: 260,
          rows: [
            { label: "Sent as", value: "Email" },
            { label: "Copy to", value: "Finance" },
          ],
        },
        {
          id: "chase",
          type: "Logic",
          ms: 300,
          rows: [
            { label: "If unpaid", value: "Reminder sent" },
            { label: "Then", value: "Escalated" },
          ],
        },
      ],
    },
  },
  {
    id: "sales",
    tab: "Sales",
    outcome: "can route and enrich every lead the minute it lands",
    flow: {
      id: "lead-to-crm",
      title: "Lead to CRM",
      totalLabel: "",
      nodes: [
        {
          id: "enquiry",
          type: "Trigger",
          chip: "Form",
          ms: 240,
          rows: [
            { label: "Source", value: "Website enquiry" },
            { label: "Captured", value: "In full" },
          ],
        },
        {
          id: "enrich",
          type: "AI",
          ms: 340,
          rows: [
            { label: "Company", value: "Matched" },
            { label: "Role", value: "Identified" },
          ],
        },
        {
          id: "route",
          type: "Logic",
          ms: 260,
          rows: [
            { label: "Owner", value: "By territory" },
            { label: "Priority", value: "Set" },
          ],
        },
        {
          id: "crm",
          type: "Action",
          chip: "CRM",
          ms: 280,
          rows: [
            { label: "Record", value: "Created" },
            { label: "Owner", value: "Notified" },
          ],
        },
      ],
    },
  },
  {
    id: "operations",
    tab: "Operations",
    outcome: "can keep stock, orders and suppliers in agreement",
    flow: {
      id: "stock-reconciliation",
      title: "Stock reconciliation",
      totalLabel: "",
      nodes: [
        {
          id: "counts",
          type: "Trigger",
          ms: 260,
          rows: [
            { label: "Source", value: "Warehouse count" },
            { label: "Format", value: "Sheet or scan" },
          ],
        },
        {
          id: "compare",
          type: "Data",
          ms: 340,
          rows: [
            { label: "Against", value: "Purchase orders" },
            { label: "Gaps", value: "Flagged", tone: "warn" },
          ],
        },
        {
          id: "resolve",
          type: "Logic",
          ms: 300,
          rows: [
            { label: "Clear cases", value: "Closed" },
            { label: "The rest", value: "Sent to a person" },
          ],
        },
        {
          id: "supplier",
          type: "Action",
          chip: "Email",
          ms: 260,
          rows: [
            { label: "Supplier", value: "Told" },
            { label: "Record", value: "Updated" },
          ],
        },
      ],
    },
  },
  {
    id: "support",
    tab: "Support",
    outcome: "can answer the same forty questions without a person",
    flow: null,
  },
  {
    id: "hr",
    tab: "HR",
    outcome: "can onboard a new starter across six systems in one go",
    flow: {
      id: "onboarding-run",
      title: "Onboarding run",
      totalLabel: "",
      nodes: [
        {
          id: "signed",
          type: "Trigger",
          ms: 240,
          rows: [
            { label: "Source", value: "Signed offer" },
            { label: "Start date", value: "Read" },
          ],
        },
        {
          id: "accounts",
          type: "Action",
          ms: 320,
          rows: [
            { label: "Email", value: "Provisioned" },
            { label: "Access", value: "Scoped" },
          ],
        },
        {
          id: "equipment",
          type: "Action",
          ms: 280,
          rows: [
            { label: "Request", value: "Raised" },
            { label: "Delivery", value: "Tracked" },
          ],
        },
        {
          id: "intro",
          type: "Action",
          chip: "Chat",
          ms: 260,
          rows: [
            { label: "Team", value: "Introduced" },
            { label: "Manager", value: "Briefed" },
          ],
        },
      ],
    },
  },
]
