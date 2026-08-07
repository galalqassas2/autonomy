"use client"

import * as React from "react"
import { animate, onScroll, utils } from "animejs"

import { chapters } from "@/lib/nav"
import { cn } from "@/lib/utils"

import { ChapterNav } from "./chapter-nav"
import { MobileDrawer } from "./header-mobile-drawer"
import { Wordmark } from "./wordmark"

export function SiteHeader() {
  const [compact, setCompact] = React.useState(false)
  const [active, setActive] = React.useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const progressRef = React.useRef<HTMLSpanElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  /* Sentinel shrinks the bar once the page scrolls a few pixels. */
  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  /* Progress line scrubbed by scroll position. */
  React.useEffect(() => {
    const bar = progressRef.current
    if (!bar) return
    utils.set(bar, { scaleX: 0 })
    const progress = animate(bar, {
      scaleX: [0, 1],
      ease: "linear",
      autoplay: onScroll({
        target: document.body,
        axis: "y",
        enter: "top top",
        leave: "bottom bottom",
        sync: true,
      }),
    })
    return () => {
      progress.revert()
    }
  }, [])

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
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-3 h-px w-px" />

      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-4">
        <div
          className={cn(
            "site-glass pointer-events-auto relative mx-auto flex w-full max-w-[1200px] items-center gap-4 overflow-hidden rounded-lg px-4 sm:px-5",
            compact ? "h-[52px]" : "h-[60px]",
          )}
        >
          <a href="#hero" className="shrink-0 text-ink">
            <Wordmark />
            <span className="sr-only">Autonomy, back to the top</span>
          </a>

          <nav aria-label="Chapters" className="mx-auto hidden xl:block">
            <ChapterNav items={chapters} activeId={active} />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a
              href="#start"
              className={cn(
                "btn btn-primary hidden h-9 px-4 md:inline-flex",
                compact && "h-[34px]",
              )}
            >
              <span className="xl:hidden">Get started</span>
              <span className="hidden xl:inline">Start your first automation</span>
            </a>

            <MobileDrawer
              chapters={chapters}
              active={active}
              open={sheetOpen}
              onOpenChange={setSheetOpen}
            />
          </div>

          <span
            ref={progressRef}
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary"
          />
        </div>
      </header>
    </>
  )
}
