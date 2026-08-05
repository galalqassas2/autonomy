import { Wordmark } from "./wordmark"

const columns = [
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

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-3">
            <Wordmark className="text-ink" />
            <p className="t-caption max-w-[26ch] text-ink-mute">
              We build the automations your business runs on. Our own AI, hosted in
              Ireland.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="mb-3 text-sm leading-none font-medium text-ink">
                {column.heading}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="t-caption text-ink-mute transition-colors duration-150 hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-caption text-ink-mute">
            Autonomy. Processed and stored in Ireland.
          </p>

          <p className="t-caption flex items-center gap-2 text-ink-mute">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
              style={{ boxShadow: "var(--glow-soft)" }}
            />
            all systems normal
          </p>
        </div>
      </div>
    </footer>
  )
}
