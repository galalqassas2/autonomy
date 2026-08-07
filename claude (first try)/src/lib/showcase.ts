import { TOOLS, type Tool } from "@/lib/tools"

/*
  What we say about a tool when someone opens it in the hero.

  Copy is keyed by category rather than by tool, because what we automate in
  Xero is what we automate in QuickBooks. One entry covers a whole family, so
  this stays a short file as the catalogue grows past the ones we show.
*/

export type Category =
  | "messaging"
  | "email"
  | "sheets"
  | "files"
  | "work"
  | "crm"
  | "support"
  | "commerce"
  | "payments"
  | "accounting"
  | "forms"
  | "calendar"
  | "database"
  | "code"
  | "ai"
  | "custom"

export type Detail = { headline: string; lines: string[] }

const DETAIL: Record<Category, Detail> = {
  messaging: {
    headline: "Auto-reply and route messages",
    lines: ["Answer routine questions from live data", "Escalate urgent threads to the right person"],
  },
  email: {
    headline: "Read, file and reply automatically",
    lines: ["Extract data from attachments into your systems", "Send follow-ups on schedule"],
  },
  sheets: {
    headline: "Keep sheets in sync",
    lines: ["Reconcile rows and flag mismatches overnight", "Build weekly reports automatically"],
  },
  files: {
    headline: "File documents on arrival",
    lines: ["Name and sort by content, not by hand", "Share with the right people only"],
  },
  work: {
    headline: "Auto-create and assign tasks",
    lines: ["Open tasks when triggers fire", "Close them when the work is done"],
  },
  crm: {
    headline: "Keep your pipeline accurate",
    lines: ["Capture, enrich and route leads in seconds", "Log calls and emails against each deal"],
  },
  support: {
    headline: "Triage tickets instantly",
    lines: ["Sort by urgency the moment they arrive", "Draft replies from your own history"],
  },
  commerce: {
    headline: "Process orders end to end",
    lines: ["Check stock and invoice automatically", "Reorder before you run out"],
  },
  payments: {
    headline: "Match and reconcile payments",
    lines: ["Match payments to invoices as they clear", "Chase overdue invoices on time"],
  },
  accounting: {
    headline: "Automate invoicing and reconciliation",
    lines: ["Invoice the moment a deal closes", "Reconcile the bank without a spreadsheet"],
  },
  forms: {
    headline: "Act on every submission",
    lines: ["Qualify and route answers on arrival", "Reply while the sender is still on the page"],
  },
  calendar: {
    headline: "Book without back and forth",
    lines: ["Show only slots that are actually free", "Confirm, remind and reschedule automatically"],
  },
  database: {
    headline: "Keep records in agreement",
    lines: ["Sync between systems without exports", "Feed reports without manual scripts"],
  },
  code: {
    headline: "Integrate with your dev workflow",
    lines: ["Trigger from commits, issues and releases", "Keep tickets and boards in step"],
  },
  ai: {
    headline: "Handle what rules cannot",
    lines: ["Parse unstructured text and documents", "Hand back to a person when unsure"],
  },
  custom: {
    headline: "Connect anything with an API",
    lines: ["Built to your endpoints, not a template", "REST, webhooks or custom integrations"],
  },
}

const CATEGORY: Record<string, Category> = {
  slack: "messaging",
  "microsoft-teams": "messaging",
  whatsapp: "messaging",
  telegram: "messaging",
  twilio: "messaging",
  gmail: "email",
  outlook: "email",
  sendgrid: "email",
  mailchimp: "email",
  brevo: "email",
  "google-sheets": "sheets",
  excel: "sheets",
  airtable: "sheets",
  "google-drive": "files",
  onedrive: "files",
  dropbox: "files",
  "aws-s3": "files",
  "google-cloud-storage": "files",
  notion: "work",
  trello: "work",
  asana: "work",
  monday: "work",
  clickup: "work",
  jira: "work",
  linear: "work",
  salesforce: "crm",
  hubspot: "crm",
  pipedrive: "crm",
  zoho: "crm",
  odoo: "crm",
  zendesk: "support",
  intercom: "support",
  shopify: "commerce",
  woocommerce: "commerce",
  magento: "commerce",
  stripe: "payments",
  paypal: "payments",
  wise: "payments",
  quickbooks: "accounting",
  xero: "accounting",
  typeform: "forms",
  calendly: "calendar",
  "cal-com": "calendar",
  zoom: "calendar",
  "google-calendar": "calendar",
  postgresql: "database",
  mysql: "database",
  mongodb: "database",
  redis: "database",
  snowflake: "database",
  bigquery: "database",
  supabase: "database",
  github: "code",
  gitlab: "code",
  openai: "ai",
  anthropic: "ai",
  "google-gemini": "ai",
  webhooks: "custom",
}

export type ShowcaseTile = Tool & { detail: Detail }

/* Marks are the same sprite the rest of the page uses, so this costs nothing. */
export const SHOWCASE: ShowcaseTile[] = TOOLS.map((tool) => ({
  ...tool,
  detail: DETAIL[CATEGORY[tool.slug] ?? "custom"],
}))
