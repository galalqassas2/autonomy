export const chapters = [
  { id: "watch-it-run", label: "Watch it run" },
  { id: "every-channel", label: "Every channel" },
  { id: "the-work", label: "The work" },
  { id: "your-time", label: "Your time" },
  { id: "what-we-connect", label: "What we connect" },
  { id: "your-data", label: "Your data" },
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
    heading: "What it does",
    links: [
      { label: "Watch it run", href: "#watch-it-run" },
      { label: "The work", href: "#the-work" },
      { label: "Your time", href: "#your-time" },
      { label: "The build", href: "#the-build" },
    ],
  },
  {
    heading: "By department",
    links: [
      { label: "Finance", href: "#departments" },
      { label: "Sales", href: "#departments" },
      { label: "Operations", href: "#departments" },
      { label: "Support", href: "#departments" },
      { label: "HR", href: "#departments" },
    ],
  },
  {
    heading: "What we connect",
    links: [
      { label: "Every integration", href: "#what-we-connect" },
      { label: "Request a connector", href: "#start" },
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
