export const chapters = [
  { id: "watch-it-run", label: "Demo" },
  { id: "what-we-automate", label: "Examples" },
  { id: "the-ai", label: "Control" },
  { id: "faq", label: "FAQ" },
] as const

export type ChapterId = (typeof chapters)[number]["id"]

/* The dark islands. The header inverts while it sits over one. */
export const darkSections: readonly ChapterId[] = [
  "watch-it-run",
] as const

export const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Demo", href: "#watch-it-run" },
      { label: "Examples", href: "#what-we-automate" },
      { label: "Control", href: "#the-ai" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Find your first automation", href: "#start" },
    ],
  },
]
