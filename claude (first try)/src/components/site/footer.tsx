import { Wordmark } from "./wordmark"
import { footerColumns as columns } from "@/lib/nav"

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(2,1fr)]">
          <div className="flex flex-col gap-3">
            <Wordmark className="text-ink" />
            <p className="t-caption max-w-[26ch] text-ink-mute">
              We automate anything your team repeats.
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

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-caption text-ink-mute">© 2026 Autonomy.</p>
          <p className="t-caption text-ink-mute">
            Automations run in Ireland. Never trained on your data.
          </p>
        </div>
      </div>
    </footer>
  )
}
