"use client"

import * as React from "react"

import { chapters } from "@/lib/nav"

import { ChapterNav } from "./chapter-nav"
import { MobileDrawer } from "./header-mobile-drawer"
import { Wordmark } from "./wordmark"

export function SiteHeader() {
  const [active, setActive] = React.useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  /* A chapter is current while it crosses the header band. */
  React.useEffect(() => {
    const targets = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(chapters.find((c) => visible.has(c.id))?.id ?? null)
      },
      { rootMargin: "-64px 0px -85% 0px", threshold: 0 },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-4">
      <div className="site-glass pointer-events-auto relative mx-auto flex h-14 w-full max-w-[1080px] items-center gap-4 overflow-hidden rounded-lg px-4 sm:px-5">
        <a href="#hero" className="shrink-0 text-ink">
          <Wordmark />
          <span className="sr-only">Autonomy, back to the top</span>
        </a>

        <nav aria-label="Main navigation" className="mx-auto hidden xl:block">
          <ChapterNav items={chapters} activeId={active} />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href="#start"
            className="btn btn-primary hidden h-9 px-4 whitespace-nowrap md:inline-flex"
          >
            Find your first automation
          </a>

          <MobileDrawer
            chapters={chapters}
            active={active}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          />
        </div>
      </div>
    </header>
  )
}
