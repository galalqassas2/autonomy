import type { Capability } from "@/types/capabilities"
export type { Capability, ChatTurn, Widget } from "@/types/capabilities"

export const CHANNEL_TINT: Record<string, string> = {
  whatsapp: "37,211,102",
  telegram: "42,171,222",
  web: "5,18,41",
}

/*
  Ten jobs, eighteen tools. Every party is a role rather than a name and no
  figure describes a real customer, so nothing here can be read as a claim.
  Swap in a reference account by editing the account and billedTo strings.
*/
export const CAPABILITIES: Capability[] = [
  {
    id: "answer",
    label: "Answer a customer at 11pm",
    team: "Support",
    tools: ["whatsapp", "shopify"],
    impact: "Answered in seconds on a Sunday night, from live stock.",
    widget: {
      kind: "chat",
      channel: "whatsapp",
      account: "Your store",
      turns: [
        { kind: "them", text: "Do you ship the walnut desk to Galway?" },
        {
          kind: "card",
          title: "Walnut standing desk",
          meta: "In stock, two day delivery",
          value: "Held",
        },
        { kind: "us", text: "We do, and there is one left. Want me to hold it?" },
        { kind: "chips", options: ["Hold it for me", "Other finishes"] },
      ],
    },
  },
  {
    id: "quote-to-cash",
    label: "Send the invoice when a deal closes",
    team: "Finance",
    tools: ["pipedrive", "xero", "stripe"],
    impact: "Xero creates it and Stripe sends the payment link immediately.",
    widget: {
      kind: "invoice",
      billedTo: "Trade customer",
      lines: [
        { desc: "Design and survey", detail: "Fixed fee", amount: "€1,200.00" },
        { desc: "Installation", detail: "Two days on site", amount: "€2,400.00" },
      ],
      totals: [
        { label: "Subtotal", value: "€3,600.00" },
        { label: "VAT at 23%", value: "€828.00" },
        { label: "Total due", value: "€4,428.00", strong: true },
      ],
      stamp: "Payment link sent",
    },
  },
  {
    id: "supplier-invoice",
    label: "File every supplier invoice",
    team: "Finance",
    tools: ["outlook", "ollama", "xero", "google-drive"],
    impact: "No more keying in PDFs. Coded and filed before you open it.",
    widget: {
      kind: "extract",
      source: {
        tool: "outlook",
        title: "Invoice attached",
        meta: "From a supplier, PDF",
      },
      raw: "Please find attached our invoice for materials supplied this month, payable within 30 days of the date shown.",
      fields: [
        { label: "Supplier", value: "Matched to your contacts" },
        { label: "Net", value: "1,845.00" },
        { label: "VAT", value: "424.35" },
        { label: "Due", value: "In 30 days" },
      ],
      filedTo: { tool: "xero", text: "Bill drafted and coded to materials" },
    },
  },
  {
    id: "chase",
    label: "Chase what you are owed",
    team: "Finance",
    tools: ["xero", "whatsapp"],
    impact: "Polite, on time, every time. Nobody has to be the bad guy.",
    widget: {
      kind: "chat",
      channel: "whatsapp",
      account: "Your accounts team",
      turns: [
        { kind: "us", text: "Quick one, your invoice fell due on Friday." },
        {
          kind: "card",
          title: "Outstanding invoice",
          meta: "Card, bank transfer or a payment plan",
          value: "Due",
        },
        { kind: "them", text: "Sorry, missed it. Paying now." },
        { kind: "us", text: "Got it, thanks. Receipt is on its way." },
      ],
    },
  },
  {
    id: "lead",
    label: "Qualify and route a new lead",
    team: "Sales",
    tools: ["typeform", "ollama", "hubspot", "slack"],
    impact: "The right rep gets a qualified lead with the full context.",
    widget: {
      kind: "record",
      header: {
        tool: "typeform",
        title: "New office fit-out enquiry",
        meta: "Website form, Dublin 8",
      },
      chips: [
        { label: "Intent", value: "Ready to start", hot: true },
        { label: "Fit", value: "Strong" },
      ],
      fields: [
        { label: "Company", value: "Matched in HubSpot" },
        { label: "Project", value: "Office fit-out" },
        { label: "Timing", value: "Ready to start" },
        { label: "Owner", value: "Leinster sales" },
      ],
      handoff: { tool: "slack", text: "Sales rep alerted with the full context" },
    },
  },
  {
    id: "call-notes",
    label: "Turn a call into CRM notes",
    team: "Sales",
    tools: ["zoom", "ollama", "hubspot"],
    impact: "The pipeline is accurate on Friday because nobody wrote it up.",
    widget: {
      kind: "extract",
      source: { tool: "zoom", title: "Call ended", meta: "Transcript collected" },
      raw: "…so the budget is signed off, but we cannot start until the new floor goes in. Send the revised scope and we will get it back to you.",
      fields: [
        { label: "Decision", value: "Budget approved" },
        { label: "Blocker", value: "Waiting on flooring" },
        { label: "Next step", value: "Send revised scope" },
        { label: "Stage", value: "Moved to proposal" },
      ],
      filedTo: { tool: "hubspot", text: "Deal updated and a task raised" },
    },
  },
  {
    id: "triage",
    label: "Escalate an urgent support ticket",
    team: "Support",
    tools: ["zendesk", "ollama", "slack"],
    impact: "The right person gets the issue with a reply ready to approve.",
    widget: {
      kind: "ticket",
      header: {
        tool: "zendesk",
        title: "Damaged delivery",
        meta: "New ticket from the web form",
      },
      message:
        "The order arrived damaged and the installer is due tomorrow. Can someone help today?",
      fields: [
        { label: "Priority", value: "Urgent" },
        { label: "Order", value: "Matched automatically" },
        { label: "Warranty", value: "Covered" },
      ],
      draft:
        "We are sorry this arrived damaged. A replacement is being arranged, and our team will confirm the timing today.",
      handoff: { tool: "slack", text: "Operations alerted with the full ticket" },
    },
  },
  {
    id: "reorder",
    label: "Draft a purchase order before stock runs out",
    team: "Operations",
    tools: ["shopify", "google-sheets", "outlook"],
    impact: "The purchase order is ready before the item sells out.",
    widget: {
      kind: "stock",
      rows: [
        { sku: "Brushed brass handle", on: 12, reorder: 40 },
        { sku: "Soft close hinge", on: 88, reorder: 50 },
        { sku: "Oak worktop, 3m", on: 31, reorder: 25 },
      ],
      order: {
        tool: "outlook",
        title: "Purchase order ready for approval",
        detail: "Supplier and quantities filled in",
      },
    },
  },
  {
    id: "book",
    label: "Book the job without the back and forth",
    team: "Operations",
    tools: ["telegram", "google-calendar"],
    impact: "Six messages become one. The diary is never double booked.",
    widget: {
      kind: "chat",
      channel: "telegram",
      account: "Your bookings line",
      turns: [
        { kind: "them", text: "Can someone come out to look at the worktop?" },
        { kind: "us", text: "Yes. Thursday morning or Friday afternoon?" },
        { kind: "them", text: "Thursday, if that suits." },
        {
          kind: "card",
          title: "Site visit, Thursday",
          meta: "Fitter assigned, details sent to the customer",
          value: "Booked",
        },
      ],
    },
  },
  {
    id: "onboard",
    label: "Start onboarding when the offer is signed",
    team: "HR",
    tools: ["outlook", "google-calendar", "slack", "google-drive"],
    impact: "Every account and first-week task starts from the signed offer.",
    widget: {
      kind: "checklist",
      header: {
        tool: "outlook",
        title: "Offer signed",
        meta: "Start date read from the contract",
      },
      rows: [
        { system: "Email", task: "Account and signature created" },
        { system: "Calendar", task: "First week scheduled" },
        { system: "Chat", task: "Channels and team added" },
        { system: "Files", task: "Policies and templates shared" },
        { system: "Access", task: "Role permissions requested" },
      ],
    },
  },
  {
    id: "monday",
    label: "Send Monday's numbers",
    team: "Management",
    tools: ["xero", "shopify", "slack"],
    impact: "One place, every Monday at eight, with no spreadsheet to build.",
    widget: {
      kind: "report",
      tool: "slack",
      title: "Last week, at a glance",
      metrics: [
        { label: "Sales", value: "42,180", delta: "8.4%", up: true, good: true },
        { label: "Overdue", value: "6,240", delta: "12.1%", up: true, good: false },
        { label: "Orders", value: "318", delta: "5.2%", up: true, good: true },
        { label: "Returns", value: "11", delta: "2.0%", up: false, good: true },
      ],
      note: "Overdue is up. That is the one to look at.",
    },
  },
]
