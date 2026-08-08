export const chapters = [
  { id: "watch-it-run", label: "See it work" },
  { id: "what-we-automate", label: "Automate" },
  { id: "the-ai", label: "AI" },
  { id: "your-data", label: "Trust" },
  { id: "faq", label: "FAQ" },
] as const

export type ChapterId = (typeof chapters)[number]["id"]

/* The dark islands. The header inverts while it sits over one. */
export const darkSections: readonly ChapterId[] = [
  "watch-it-run",
  "your-data",
] as const

export const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "See it work", href: "#watch-it-run" },
      { label: "What we automate", href: "#what-we-automate" },
      { label: "What the AI does", href: "#the-ai" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Data and ownership", href: "#your-data" },
      { label: "Common questions", href: "#faq" },
      { label: "Find your first automation", href: "#start" },
    ],
  },
]
