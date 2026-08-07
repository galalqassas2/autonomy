export const chapters = [
  { id: "watch-it-run", label: "Demo" },
  { id: "what-we-automate", label: "Automate" },
  { id: "the-work", label: "Impact" },
  { id: "the-build", label: "Process" },
  { id: "what-we-connect", label: "Tools" },
  { id: "your-data", label: "Trust" },
] as const

export type ChapterId = (typeof chapters)[number]["id"]

/* The dark islands. The header inverts while it sits over one. */
export const darkSections: readonly ChapterId[] = [
  "watch-it-run",
  "what-we-connect",
  "your-data",
] as const

export const footerColumns = [
  {
    heading: "What we automate",
    links: [
      { label: "Watch it run", href: "#watch-it-run" },
      { label: "What it costs you", href: "#the-work" },
      { label: "What you get back", href: "#your-time" },
      { label: "How we build it", href: "#the-build" },
    ],
  },
  {
    heading: "By team",
    links: ["Finance", "Sales", "Operations", "Support", "HR", "Management"].map(
      (label) => ({ label, href: "#what-we-automate" }),
    ),
  },
  {
    heading: "Tools",
    links: [
      { label: "Connected tools", href: "#what-we-connect" },
      { label: "Ask us about a tool", href: "#start" },
      { label: "Custom API work", href: "#what-we-connect" },
    ],
  },
  {
    heading: "Your data",
    links: [
      { label: "Where it lives", href: "#your-data" },
      { label: "What we promise", href: "#your-data" },
      { label: "Common questions", href: "#faq" },
    ],
  },
]
